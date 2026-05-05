import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "./schema"
import dotenv from "dotenv"
import { Pool } from "pg"

dotenv.config()

export type Database = NodePgDatabase<typeof schema>

const pool = new Pool({
  connectionString: process.env.DATABASE_POOL_URL!,
  max: 10,
})

export const db = drizzle(pool, { schema })
