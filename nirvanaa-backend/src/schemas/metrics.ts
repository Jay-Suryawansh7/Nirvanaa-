import { pgTable, uuid, integer, decimal } from "drizzle-orm/pg-core";

// export const lawyersSchema = pgSchema("lawyers");

export const lawyerMetrics = pgTable("lawyer_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  lawyerId: uuid("lawyer_id").notNull(),
  confirmationRate: decimal("confirmation_rate").default("0"),
  noShows: integer("no_shows").default(0),
  avgResponseTime: integer("avg_response_time").default(0), // in minutes
});
