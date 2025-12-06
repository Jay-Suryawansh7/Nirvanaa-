import { drizzle } from "drizzle-orm/node-postgres";
import pool from './db';

// Use the existing pool from db.ts
export const db = drizzle(pool);
