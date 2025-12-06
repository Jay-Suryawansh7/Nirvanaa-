import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: any = {
    ssl: { rejectUnauthorized: false }, // Relaxed SSL for better compatibility
    connectionTimeoutMillis: 20000
};

if (process.env.DATABASE_URL) {
    // Parse URL to safely remove params
    const dbUrl = new URL(process.env.DATABASE_URL);
    dbUrl.searchParams.delete('sslmode');
    dbUrl.searchParams.delete('channel_binding');
    poolConfig.connectionString = dbUrl.toString();
}

const pool = new Pool(poolConfig);

// Handle idle connection errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // Don't crash the app on idle client error
});

// Test connection on startup
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL Database (NeonDB)');
        client.release();
    } catch (err) {
        console.error('❌ Database connection error:', err);
    }
};

testConnection();

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
