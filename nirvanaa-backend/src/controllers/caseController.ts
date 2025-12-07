import { Request, Response } from "express";
import { db } from "../config/db";
import { cases } from "../schemas/cases";
import { documents } from "../schemas/documents";
import { eq, desc } from "drizzle-orm";
import { calculateReadinessScore, getReadinessStatus } from "../utils/readiness";
import { sendNotification } from "../services/notificationService";

import { users } from "../schemas/users";

export const getAllCases = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    // Base query with join
    let query = db.select({
        caseData: cases,
        lawyerName: users.name
    })
    .from(cases)
    .leftJoin(users, eq(cases.assignedLawyerId, users.id));
    
    // Filter for Lawyers: only show cases assigned to them
    if (user && user.role === "LAWYER") {
        // @ts-ignore - drizzle type complexity
        query = query.where(eq(cases.assignedLawyerId, user.userId));
    }

    // @ts-ignore
    const allCases = await query.orderBy(desc(cases.nextHearingDate)).limit(100);
    
    // Enrich with computed status
    const enrichedCases = allCases.map(row => {
      const c = row.caseData;
      const docsReady = c.documentStatus === "READY";
      const score = calculateReadinessScore(c.lawyerConfirmation || false, c.witnessConfirmation || false, docsReady);
      
      return {
        ...c,
        assignedLawyerName: row.lawyerName,
        computedScore: score,
        readinessStatus: getReadinessStatus(score)
      };
    });

    res.json(enrichedCases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cases", error });
  }
};

export const getCaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`[getCaseById] Fetching case ID: ${id}`);

    // Join with users table to get lawyer name
    const result = await db.select({
        caseData: cases,
        lawyerName: users.name
    })
    .from(cases)
    .leftJoin(users, eq(cases.assignedLawyerId, users.id))
    .where(eq(cases.id, id));
    
    if (result.length === 0) {
        console.warn(`[getCaseById] Case not found: ${id}`);
        return res.status(404).json({ message: "Case not found" });
    }

    const { caseData, lawyerName } = result[0];

    // Fetch documents
    const caseDocuments = await db.select().from(documents).where(eq(documents.caseId, id));

    const score = calculateReadinessScore(
      caseData.lawyerConfirmation || false,
      caseData.witnessConfirmation || false,
      caseData.documentStatus === "READY"
    );

    res.json({
      ...caseData,
      assignedLawyerName: lawyerName,
      documents: caseDocuments, // Return documents
      computedScore: score,
      readinessStatus: getReadinessStatus(score)
    });
  } catch (error) {
    // @ts-ignore
    console.error(`[getCaseById] Error: ${error.message}`, error);
    res.status(500).json({ message: "Error fetching case", error });
  }
};

export const updateCaseConfirmation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, status } = req.body; // type: 'lawyer' | 'witness', status: boolean

    const updateData: any = {};
    if (type === "lawyer") updateData.lawyerConfirmation = status;
    if (type === "witness") updateData.witnessConfirmation = status;

    const [updatedCase] = await db.update(cases)
      .set(updateData)
      .where(eq(cases.id, id))
      .returning();

    // Trigger notification if confirmed
    if (status) {
        // Find users linked to case to notify (mock logic)
        sendNotification("1234567890", `Confirmation received for Case ${updatedCase.caseNumber}`);
    }

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: "Error updating confirmation", error });
  }
};

export const rescheduleCase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;

    if (!newDate) {
        return res.status(400).json({ message: "New hearing date is required" });
    }

    const updateData: any = {
        nextHearingDate: new Date(newDate),
        status: "SCHEDULED"
    };

    if (newTime) {
        updateData.hearingTime = newTime;
    }

    const [updatedCase] = await db.update(cases)
      .set(updateData)
      .where(eq(cases.id, id))
      .returning();

    if (!updatedCase) {
        return res.status(404).json({ message: "Case not found" });
    }

    // Notify participants
    const notificationMsg = `Case ${updatedCase.caseNumber} rescheduled to ${new Date(newDate).toDateString()}${newTime ? ' at ' + newTime : ''}${reason ? '. Reason: ' + reason : ''}`;
    sendNotification("ALL_PARTICIPANTS", notificationMsg);

    res.json({
        success: true,
        message: "Case rescheduled",
        case: updatedCase
    });
  } catch (error) {
    console.error("Error rescheduling case:", error);
    res.status(500).json({ message: "Error rescheduling case", error });
  }
};

export const createCase = async (req: Request, res: Response) => {
  try {
    const { caseNumber, caseTitle, courtType, category, nextHearingDate, documents: docList } = req.body;
    const userId = req.user?.userId;

    // Basic Validation
    if (!caseNumber || !caseTitle) {
        return res.status(400).json({ message: "Case Number and Title are required" });
    }

    // Insert Case
    const [newCase] = await db.insert(cases).values({
        caseNumber,
        caseTitle,
        courtType,
        category,
        nextHearingDate: new Date(nextHearingDate),
        assignedLawyerId: userId, // Auto-assign to creating lawyer
        status: "PENDING",
        documentStatus: docList && docList.length > 0 ? "PARTIAL" : "PENDING"
    }).returning();

    // Insert Documents (Checklist items)
    if (docList && Array.isArray(docList) && docList.length > 0) {
        const docInserts = docList.map((doc: string) => ({
            caseId: newCase.id,
            checklistItem: doc,
            isReady: true // Assuming uploaded docs are ready
        }));
        await db.insert(documents).values(docInserts);
    }

    res.status(201).json({ success: true, message: "Case created successfully", case: newCase });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ message: "Error creating case", error });
  }
};
