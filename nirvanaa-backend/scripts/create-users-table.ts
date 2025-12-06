import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    console.error('❌ DATABASE_URL is undefined!');
    process.exit(1);
}

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
});

async function createUsersTable() {
    const client = await pool.connect();

    try {
        // Check if users table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);

        if (tableCheck.rows[0].exists) {
            console.log('✅ Users table already exists!');
        } else {
            console.log('📦 Creating users table...');
            await client.query(`
                CREATE TABLE IF NOT EXISTS "users" (
                    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                    "name" varchar(100),
                    "email" varchar(150) NOT NULL,
                    "password" varchar(255) NOT NULL,
                    "role" "role" DEFAULT 'LAWYER' NOT NULL,
                    "created_at" timestamp DEFAULT now(),
                    CONSTRAINT "users_email_unique" UNIQUE("email")
                );
            `);
            console.log('✅ Users table created successfully!');
        }

        // Show table info
        const columns = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log('\n📋 Users table columns:');
        columns.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type}`);
        });

    } catch (err: any) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

createUsersTable();
