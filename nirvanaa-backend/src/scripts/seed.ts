import { db } from "../config/db";
import { cases, caseStatusEnum } from "../schemas/cases";
import { users } from "../schemas/users";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const CATEGORIES = ["Civil", "Criminal", "Bail", "Family", "Property", "Consumer", "Commercial"];
const COURT_TYPES = ["District Court", "High Court", "Sessions Court", "Family Court"];

export const seedMockData = async () => {
  console.log("Seeding mock data...");

  // Check if data exists
  const existingCases = await db.select().from(cases).limit(1);
  if (existingCases.length > 0) {
    console.log("Data already exists, skipping seed.");
    return;
  }

  // Create mock users (Judge, Lawyer, Staff)
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const mockUsers = [
    { name: "Judge Judy", email: "judge@court.com", role: "JUDGE" },
    { name: "Lawyer Saul", email: "lawyer@court.com", role: "LAWYER" },
    { name: "Staff Steve", email: "staff@court.com", role: "STAFF" },
  ];

  await db.insert(users).values(
    mockUsers.map(u => ({
      name: u.name,
      email: u.email,
      phone: "1234567890",
      passwordHash,
      role: u.role,
      verified: true,
    }))
  );

  // Generate 1000 Cases
  const mockCases = [];
  for (let i = 0; i < 1000; i++) {
    const isReady = Math.random() > 0.7;
    const documentStatus = isReady ? "READY" : "PENDING";
    mockCases.push({
      caseNumber: `CASE-${2025}-${1000 + i}`,
      caseTitle: `Party A vs Party B ${i}`,
      courtType: COURT_TYPES[Math.floor(Math.random() * COURT_TYPES.length)],
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      nextHearingDate: new Date(Date.now() + Math.random() * 10000000000), // Future date
      hearingTime: "10:00 AM",
      status: "PENDING",
      documentStatus,
      readinessScore: Math.floor(Math.random() * 100),
      witnessRequired: Math.random() > 0.5,
      lawyerConfirmation: Math.random() > 0.5,
      witnessConfirmation: Math.random() > 0.5,
    });
  }

  // Batch insert (Drizzle might limit batch size, split if needed)
  const BATCH_SIZE = 50;
  for (let i = 0; i < mockCases.length; i += BATCH_SIZE) {
      await db.insert(cases).values(mockCases.slice(i, i + BATCH_SIZE));
  }

  console.log("Seeding complete!");
};

seedMockData().then(() => {
    console.log("Seed script finished");
    process.exit(0);
}).catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
