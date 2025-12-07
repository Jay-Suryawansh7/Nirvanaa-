import { uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // Judge, Lawyer, Staff, etc.
  type: varchar("type", { length: 50 }).notNull(), // Categorization
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 100 }),
  organization: varchar("organization", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});
