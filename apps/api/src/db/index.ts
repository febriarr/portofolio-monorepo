import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "./schema/index.js"

export type Database = NodePgDatabase<typeof schema>

export const db = drizzle(process.env.DATABASE_URL!, { schema })
