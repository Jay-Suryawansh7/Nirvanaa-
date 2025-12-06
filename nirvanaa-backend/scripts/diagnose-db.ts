import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env from parent directory or current
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Assuming script is in scripts/ folder

// Fix: Strip channel_binding which causes issues
let dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    dbUrl = dbUrl.replace('channel_binding=require', '');
    dbUrl = dbUrl.replace('&sslmode=require', ''); // Let pg handle ssl via options
    dbUrl = dbUrl.replace('?sslmode=require', '?');
}

console.log('--- DB DIAGNOSTIC ---');
if (!dbUrl) {
    console.error('❌ DATABASE_URL is undefined!');
    process.exit(1);
}

// Mask password for logging
const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
console.log(`📡 URL: ${maskedUrl}`);

const configs = [
    { name: 'Strict SSL', ssl: { rejectUnauthorized: true } },
    { name: 'Permissive SSL', ssl: { rejectUnauthorized: false } },
    { name: 'No SSL', ssl: false }
];

async function testConnections() {
    for (const config of configs) {
        console.log(`\n🔄 Testing mode: ${config.name}...`);
        const p = new Pool({
            connectionString: dbUrl,
            ssl: config.ssl,
            connectionTimeoutMillis: 20000, // 20s for cold start
        });

        try {
            const client = await p.connect();
            console.log(`✅ SUCCESS with ${config.name}!`);
            const res = await client.query('SELECT NOW()');
            console.log('🕒 Time:', res.rows[0].now);
            client.release();
            await p.end();
            process.exit(0); // Exit on first success
        } catch (err: any) {
            console.log(`❌ Failed (${config.name}): ${err.message}`);
            await p.end();
        }
    }
    console.error('\n💥 All connection modes failed.');
    process.exit(1);
}

testConnections();
