"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const dotenv = __importStar(require("dotenv"));
const db_1 = require("./src/config/db");
const drizzle_orm_1 = require("drizzle-orm");
const http_1 = require("http");
dotenv.config();
const DEFAULT_PORT = parseInt(process.env.PORT || "5000");
const startServer = async () => {
    console.log("Initializing backend server...");
    try {
        // 1. Check DB connection
        console.log("Connecting to database...");
        await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1`);
        console.log("✅ Database connected successfully.");
        // 2. Run seeding (optional, log errors but don't crash)
        try {
            // await seedMockData(); 
        }
        catch (seedError) {
            console.warn("⚠️ Seeding failed (non-critical):", seedError);
        }
        // 3. Start Server with Port Fallback
        const startListener = (port) => {
            const server = (0, http_1.createServer)(app_1.default);
            server.listen(port, () => {
                console.log(`🚀 Server running on port ${port}`);
                console.log(`➜  API URL: http://localhost:${port}/api`);
            });
            server.on("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    console.warn(`⚠️  Port ${port} is in use (likely AirPlay on MacOS).`);
                    console.log(`🔄 Retrying on port ${port + 1}...`);
                    startListener(port + 1);
                }
                else {
                    console.error("❌ Failed to start server:", err);
                    process.exit(1);
                }
            });
        };
        startListener(DEFAULT_PORT);
    }
    catch (error) {
        console.error("❌ Critical Startup Error:", error);
        process.exit(1);
    }
};
startServer();
