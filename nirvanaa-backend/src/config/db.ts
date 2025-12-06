import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
});

// Test connection on startup
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database (NeonDB)'))
    .catch(err => console.error('❌ Database connection error:', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
