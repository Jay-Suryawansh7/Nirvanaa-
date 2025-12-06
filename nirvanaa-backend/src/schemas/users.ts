import { pgSchema, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

// export const sharedSchema = pgSchema("shared"); // Removed to use public schema
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // JUDGE | LAWYER | STAFF
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
