import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
};
