import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: any = {
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 20000 // 20s for cold starts
};

if (process.env.DATABASE_URL) {
    // Parse URL to safely remove params
    const dbUrl = new URL(process.env.DATABASE_URL);
    dbUrl.searchParams.delete('sslmode');
    dbUrl.searchParams.delete('channel_binding');
    poolConfig.connectionString = dbUrl.toString();
}

const pool = new Pool(poolConfig);

// Test connection on startup
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database (NeonDB)'))
    .catch(err => console.error('❌ Database connection error:', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
