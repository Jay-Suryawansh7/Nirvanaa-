import { uuid, varchar, timestamp, boolean, text, integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const confirmations = pgTable("confirmations", {
  id: uuid("id").defaultRandom().primaryKey(),
  lawyerId: uuid("lawyer_id"),
  caseId: uuid("case_id"),
  status: varchar("status", { length: 20 }).notNull(), // confirmed / declined / pending
  timestamp: timestamp("timestamp").defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").notNull(),
  checklistItem: text("checklist_item").notNull(), // e.g. "Petition", "Affidavit" - acts as title
  fileName: varchar("file_name", { length: 255 }),
  fileUrl: text("file_url"), // URL or path to storage
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"), // Size in bytes
  isReady: boolean("is_ready").default(false),
  status: varchar("status", { length: 20 }).default("PENDING"), // VERIFIED, REJECTED, PENDING
  uploadedBy: uuid("uploaded_by"),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
