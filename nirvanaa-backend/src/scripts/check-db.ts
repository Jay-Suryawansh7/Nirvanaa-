import { db } from "../config/db";
import { cases } from "../schemas/cases";
import { users } from "../schemas/users";
import * as dotenv from "dotenv";

dotenv.config();

const checkDb = async () => {
    try {
        const caseCount = await db.select().from(cases);
        const userCount = await db.select().from(users);
        console.log(`Cases count: ${caseCount.length}`);
        console.log(`Users count: ${userCount.length}`);
        process.exit(0);
    } catch (error) {
        console.error("DB Check failed:", error);
        process.exit(1);
    }
};

checkDb();
