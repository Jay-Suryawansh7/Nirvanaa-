# 🔐 Authentication & RBAC with Drizzle ORM + PostgreSQL (Next.js Guide)

This guide explains **step-by-step** how to implement:

- User Authentication (email + password)
- Role-Based Access Control (RBAC)
- JWT-based session authentication
- Protected API routes
- Secure password hashing  
- Drizzle ORM + PostgreSQL schema setup  
- Middleware for role checks  

Works perfectly for:
- Judges  
- Lawyers  
- Court Staff  
- Admins  

---

# 📁 1. Project Structure (Recommended)

```
src/
  app/
    api/
      auth/
        login/route.ts
        register/route.ts
      protected/route.ts
  lib/
    db.ts
    drizzle.ts
    auth.ts
    jwt.ts
  schemas/
    users.ts
    roles.ts
```

---

# 🗄️ 2. Database Schema (Drizzle ORM)

Create **users** table + **roles enum**.

## `schemas/users.ts`

```ts
import { pgTable, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
  createdAt: sql`NOW()`,
});
```

# 🔧 3. Connect Drizzle to PostgreSQL

## `lib/db.ts`

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

# 🔑 4. Register Route (Password Hashing)

## `api/auth/register/route.ts`

```ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/schemas/users";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    password: hashed,
    role,
  });

  return NextResponse.json({ message: "User registered" });
}
```

# 🔐 5. Login Route (JWT Authentication)

## `lib/jwt.ts`

```ts
import jwt from "jsonwebtoken";

export function signToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
```

## `api/auth/login/route.ts`

```ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "@/schemas/users";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await db.select().from(users).where(eq(users.email, email));

  if (!user[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const valid = await bcrypt.compare(password, user[0].password);
  if (!valid) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  const token = signToken({
    id: user[0].id,
    email: user[0].email,
    role: user[0].role,
  });

  return NextResponse.json({ token });
}
```

# 🔒 6. Protecting API Routes (JWT Middleware)

## `lib/auth.ts`

```ts
import { verifyToken } from "./jwt";

export function requireAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Invalid token");

  return verifyToken(token);
}
```

# 🛡️ 7. Role-Based Access Control (RBAC)

## `lib/auth.ts` (Add RBAC helper)

```ts
export function requireRole(user: any, allowed: string[]) {
  if (!allowed.includes(user.role)) {
    throw new Error("Access denied");
  }
}
```

# 🔐 8. Example Protected API Route

## `api/protected/route.ts`

```ts
import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = requireAuth(req);

    // Example: Only Judges & Admins can view this route
    requireRole(user, ["JUDGE", "ADMIN"]);

    return NextResponse.json({
      message: "Protected content visible",
      user,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
```

# 🧭 9. How Roles Work in This System

| Role | Permissions |
|---|---|
| **JUDGE** | Full case management, mediation, read metrics |
| **LAWYER** | Confirm hearings, view assigned cases |
| **COURT_STAFF** | Manage case data, witness/doc status |
| **ADMIN** | Manage courts, users, configs |

# 🔥 10. Using Auth on Frontend (Next.js)

Example: Send token on API requests

```ts
const token = localStorage.getItem("token");

const res = await fetch("/api/protected", {
  headers: { Authorization: `Bearer ${token}` },
});
```

# 🧪 11. Testing Your Auth

**Register:**
```
POST /api/auth/register
{
  "name": "John",
  "email": "john@court.com",
  "password": "123456",
  "role": "JUDGE"
}
```

**Login:**
```
POST /api/auth/login
{
  "email": "john@court.com",
  "password": "123456"
}
```

**Access protected route:**
```
GET /api/protected
Headers: Authorization: Bearer <token>
```
