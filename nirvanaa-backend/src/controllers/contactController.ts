import { Request, Response } from "express";
import { db } from "../config/db";
import { contacts } from "../schemas/contacts";
import { eq, desc } from "drizzle-orm";

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const allContacts = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    res.json(allContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role, type, email, phone, location, organization } = req.body;
    
    if (!name || !email || !role) {
      res.status(400).json({ message: "Name, email, and role are required" });
      return;
    }

    const newContact = await db.insert(contacts).values({
      name,
      role,
      type,
      email,
      phone,
      location,
      organization
    }).returning();

    res.status(201).json(newContact[0]);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Error creating contact" });
  }
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedContact = await db.update(contacts)
      .set(updates)
      .where(eq(contacts.id, id))
      .returning();

    if (!updatedContact.length) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    res.json(updatedContact[0]);
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Error updating contact" });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params;
      const deleted = await db.delete(contacts).where(eq(contacts.id, id)).returning();
      
      if (!deleted.length) {
          res.status(404).json({ message: "Contact not found" });
          return;
      }
      
      res.json({ message: "Contact deleted successfully" });
  } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Error deleting contact" });
  }
}
