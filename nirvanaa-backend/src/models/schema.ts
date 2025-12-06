import { pgTable, varchar, uuid, pgEnum, timestamp } from "drizzle-orm/pg-core";

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
