import { uuid, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const hearingTypeEnum = pgEnum("hearing_type", [
  "INITIAL_HEARING",
  "TRIAL",
  "SENTENCING",
  "BAIL_HEARING",
  "MOTION",
  "MEDIATION",
  "CASE_REVIEW",
  "FINAL_HEARING",
  "ADMINISTRATIVE",
  "ARRAIGNMENT"
]);

export const hearingStatusEnum = pgEnum("hearing_status", [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED",
  "POSTPONED",
  "CONFIRMED"
]);

export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const hearings = pgTable("hearings", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id"), // Ideally a foreign key, but we'll keep it loose for now to avoid strict dependency issues during migration if cases table is empty
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // Using varchar instead of enum for flexibility, or map from enum
  status: varchar("status", { length: 20 }).default("SCHEDULED"),
  priority: varchar("priority", { length: 20 }).default("MEDIUM"),
  date: timestamp("date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(), // e.g., "10:00 AM"
  endTime: varchar("end_time", { length: 10 }).notNull(), // e.g., "11:00 AM"
  location: varchar("location", { length: 100 }).notNull(),
  judgeName: varchar("judge_name", { length: 100 }),
  plaintiff: varchar("plaintiff", { length: 100 }),
  defendant: varchar("defendant", { length: 100 }),
  participants: text("participants"), // JSON string or comma-separated list
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
