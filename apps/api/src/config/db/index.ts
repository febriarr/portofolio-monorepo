import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "./schema"
import dotenv from "dotenv"
import { Pool } from "pg"
import { env } from "../env"

dotenv.config()

export type Database = NodePgDatabase<typeof schema>

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(pool, { schema })
