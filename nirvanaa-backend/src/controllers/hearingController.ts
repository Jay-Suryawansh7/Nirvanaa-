import { Request, Response } from "express";
import { db } from "../config/db";
import { hearings } from "../schemas/hearings";
import { eq, desc } from "drizzle-orm";
import { expandToUuid } from "../utils/uuidHelper";

export const getHearings = async (req: Request, res: Response): Promise<void> => {
  try {
    const allHearings = await db.select().from(hearings).orderBy(desc(hearings.date));
    res.json(allHearings);
  } catch (error) {
    console.error("Error fetching hearings:", error);
    res.status(500).json({ message: "Error fetching hearings" });
  }
};

export const createHearing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, date, startTime, endTime, location, priority, description, caseId } = req.body;
    
    // Basic validation
    if (!title || !date || !startTime || !endTime || !location) {
      res.status(400).json({ message: "Missing required fields" });
      return; 
    }

    const newHearing = await db.insert(hearings).values({
      title,
      type,
      date: new Date(date),
      startTime,
      endTime,
      location,
      priority: priority || "MEDIUM",
      description,
      caseId: expandToUuid(caseId)
    }).returning();

    res.status(201).json(newHearing[0]);
  } catch (error) {
    console.error("Error creating hearing:", error);
    res.status(500).json({ message: "Error creating hearing" });
  }
};

export const updateHearing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedHearing = await db.update(hearings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(hearings.id, id))
      .returning();

    if (!updatedHearing.length) {
      res.status(404).json({ message: "Hearing not found" });
      return;
    }

    res.json(updatedHearing[0]);
  } catch (error) {
    console.error("Error updating hearing:", error);
    res.status(500).json({ message: "Error updating hearing" });
  }
};

export const deleteHearing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await db.delete(hearings).where(eq(hearings.id, id)).returning();
    
    if (!deleted.length) {
        res.status(404).json({ message: "Hearing not found" });
        return;
    }

    res.json({ message: "Hearing deleted successfully" });
  } catch (error) {
    console.error("Error deleting hearing:", error);
    res.status(500).json({ message: "Error deleting hearing" });
  }
};
