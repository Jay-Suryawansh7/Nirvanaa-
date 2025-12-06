import { uuid, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";
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
  checklistItem: text("checklist_item").notNull(),
  isReady: boolean("is_ready").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});
