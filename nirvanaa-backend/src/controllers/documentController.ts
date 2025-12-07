import { Request, Response } from "express";
import { db } from "../config/db";
import { documents } from "../schemas/documents";
import { eq, desc } from "drizzle-orm";

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const allDocs = await db.select().from(documents).orderBy(desc(documents.updatedAt));
    res.json(allDocs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Error fetching documents" });
  }
};

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { caseId, checklistItem, fileName, fileUrl, mimeType, size, status } = req.body;
    
    if (!caseId || !checklistItem) {
      res.status(400).json({ message: "Case ID and Checklist Item name are required" });
      return;
    }

    const newDoc = await db.insert(documents).values({
      caseId,
      checklistItem,
      fileName,
      fileUrl,
      mimeType,
      size,
      status: status || "PENDING",
      isReady: status === "VERIFIED"
    }).returning();

    res.status(201).json(newDoc[0]);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Error creating document" });
  }
};

export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDoc = await db.update(documents)
       .set({ ...updates, updatedAt: new Date() })
       .where(eq(documents.id, id))
       .returning();
    
    if (!updatedDoc.length) {
        res.status(404).json({ message: "Document not found" });
        return;
    }

    res.json(updatedDoc[0]);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document" });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleted = await db.delete(documents).where(eq(documents.id, id)).returning();
        
        if (!deleted.length) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        
        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Error deleting document" });
    }
}
