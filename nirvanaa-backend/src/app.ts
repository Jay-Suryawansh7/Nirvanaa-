import express from "express";
import cors from "cors";
import helmet from "helmet";
import { json } from "express";

const app = express();

// CORS Configuration - Must be first
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "https://nirvanaa.onrender.com"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests is already done by the global cors middleware above
// app.options("*", cors()); // Removed to fix Express 5 PathError

app.use(helmet());
app.use(json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

import authRoutes from "./routes/authRoutes";
import caseRoutes from "./routes/caseRoutes";
import hearingRoutes from "./routes/hearingRoutes";
import contactRoutes from "./routes/contactRoutes";
import documentRoutes from "./routes/documentRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/hearings", hearingRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/documents", documentRoutes);


export default app;
