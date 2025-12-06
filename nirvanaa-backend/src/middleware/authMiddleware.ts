import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ success: false, message: "Access Token Required" });

  const user = verifyToken(token);
  if (!user) return res.status(403).json({ success: false, message: "Invalid or Expired Token" });

  req.user = user;
  next();
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
    }
    next();
  };
};
