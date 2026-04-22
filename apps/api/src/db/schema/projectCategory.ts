import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "./utils"

export const projectCategory = pgTable("project_categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }),
  ...timestamps,
})
