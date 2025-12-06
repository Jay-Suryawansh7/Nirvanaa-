import { pgTable, varchar, uuid, pgEnum, timestamp, text, integer, boolean } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "JUDGE",
  "LAWYER",
  "COURT_STAFF",
  "ADMIN",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 150 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("LAWYER").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const caseStatusEnum = pgEnum("case_status", ['READY', 'MEDIATION_READY', 'WAITING', 'PARTIALLY_READY', 'HIGH_RISK']);
export const mediationWillingEnum = pgEnum("mediation_willing", ['NONE', 'ONE_PARTY', 'BOTH']);

export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseNumber: varchar("case_number", { length: 50 }).unique().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).default('Civil'),
  
  status: caseStatusEnum("status").default('WAITING'),
  readinessScore: integer("readiness_score").default(0),
  
  lawyerConfirmed: boolean("lawyer_confirmed").default(false),
  witnessConfirmed: boolean("witness_confirmed").default(false),
  documentsReady: boolean("documents_ready").default(false),
  
  mediationWilling: mediationWillingEnum("mediation_willing").default('NONE'),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
