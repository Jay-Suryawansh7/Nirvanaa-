import { Request, Response } from "express";
import { db } from "../config/db";
import { users } from "../schemas/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().optional(),
  role: z.enum(["JUDGE", "LAWYER", "STAFF"]),
}).refine((data) => {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Mock OTP sending
    console.log(`sending OTP to ${data.phone}... (MOCKED)`);

    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
      verified: true, // Auto-verify for now
    }).returning();

    res.status(201).json({ 
        success: true, 
        message: "User registered successfully", 
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: error.issues[0].message, errors: error.issues });
    }
    console.error("Registration error:", error);
    res.status(400).json({ success: false, message: "Registration failed", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ 
        success: true, 
        token: accessToken, // Alias for requirement
        accessToken, 
        role: user.role,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid input", errors: error.issues });
    }
    res.status(400).json({ success: false, message: "Login failed", error: error.message });
  }
};


export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const payload = await import("../utils/jwt").then(m => m.verifyRefreshToken(refreshToken));
    
    if (!payload) {
        return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }

    // Generate new Access Token
    const accessToken = await import("../utils/jwt").then(m => m.generateAccessToken(payload.userId, payload.role));

    res.json({ 
        success: true, 
        token: accessToken,
        accessToken,
        role: payload.role
    });

  } catch (error) {
    console.error("Refresh error:", error);
    res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};
