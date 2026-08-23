import assert from "node:assert";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

assert(process.env.DATABASE_URL, "you need a DB URL");

export const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

export default db;