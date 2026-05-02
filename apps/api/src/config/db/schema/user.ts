import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "./utils"

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 64 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  ...timestamps,
})
