import app from "./app";
import * as dotenv from "dotenv";
import { db } from "./config/db";
import { seedMockData } from "./scripts/seed";
import { sql } from "drizzle-orm";
import { createServer } from "http";

dotenv.config();

const DEFAULT_PORT = parseInt(process.env.PORT || "5000");

const startServer = async () => {
  console.log("Initializing backend server...");

  try {
    // 1. Check DB connection
    console.log("Connecting to database...");
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connected successfully.");

    // 2. Run seeding (optional, log errors but don't crash)
    try {
      // await seedMockData(); 
    } catch (seedError) {
      console.warn("⚠️ Seeding failed (non-critical):", seedError);
    }

    // 3. Start Server with Port Fallback
    const startListener = (port: number) => {
      const server = createServer(app);
      
      server.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`➜  API URL: http://localhost:${port}/api`);
      });

      server.on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.warn(`⚠️  Port ${port} is in use (likely AirPlay on MacOS).`);
          console.log(`🔄 Retrying on port ${port + 1}...`);
          startListener(port + 1);
        } else {
          console.error("❌ Failed to start server:", err);
          process.exit(1);
        }
      });
    };

    startListener(DEFAULT_PORT);

  } catch (error) {
    console.error("❌ Critical Startup Error:", error);
    process.exit(1);
  }
};

startServer();
