import { uuid, varchar, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const caseStatusEnum = pgEnum("case_status", ["PENDING", "SCHEDULED", "COMPLETED", "ADJOURNED"]);

export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseNumber: varchar("case_number", { length: 50 }).notNull().unique(),
  caseTitle: text("case_title").notNull(),
  courtType: varchar("court_type", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Civil, Criminal, etc.
  assignedLawyerId: uuid("assigned_lawyer_id"), // Can be linked to users.id if lawyer is in system
  nextHearingDate: timestamp("next_hearing_date"),
  hearingTime: varchar("hearing_time", { length: 10 }),
  status: varchar("status", { length: 20 }).default("PENDING"),
  documentStatus: varchar("document_status", { length: 20 }).default("PENDING"),
  readinessScore: integer("readiness_score").default(0),
  witnessRequired: boolean("witness_required").default(false),
  lawyerConfirmation: boolean("lawyer_confirmation").default(false),
  witnessConfirmation: boolean("witness_confirmation").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  action: varchar("action", { length: 255 }).notNull(),
  userId: uuid("user_id"),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: text("metadata"), // JSON string
});
