"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
});
// Test connection on startup
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database (NeonDB)'))
    .catch(err => console.error('❌ Database connection error:', err));
const query = (text, params) => pool.query(text, params);
exports.query = query;
exports.default = pool;
//# sourceMappingURL=db.js.map