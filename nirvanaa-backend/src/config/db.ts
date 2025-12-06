import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: any = {
    ssl: {
        rejectUnauthorized: false, // Required for NeonDB
        // NeonDB requires SSL
    },
    connectionTimeoutMillis: 30000, // Increased for cold starts
    idleTimeoutMillis: 20000, // Close idle connections after 20s
    max: 3, // Lower for serverless to avoid connection limits
    allowExitOnIdle: true, // Allow process to exit when pool is idle
};

if (process.env.DATABASE_URL) {
    // Use DATABASE_URL directly - NeonDB handles SSL internally
    poolConfig.connectionString = process.env.DATABASE_URL;
}

const pool = new Pool(poolConfig);

// Handle idle connection errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    // process.exit(-1); // Don't crash the app on idle client error
});

// Test connection on startup with retry for cold starts
const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            console.log('✅ Connected to PostgreSQL Database (NeonDB)');
            client.release();
            return;
        } catch (err) {
            console.log(`⏳ Connection attempt ${i + 1}/${retries} failed, retrying...`);
            if (i === retries - 1) {
                console.error('❌ Database connection error:', err);
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
            }
        }
    }
};

testConnection();

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
