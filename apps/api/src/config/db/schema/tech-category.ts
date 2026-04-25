import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "./utils"

export const techCategory = pgTable("tech_categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }).notNull(),
  ...timestamps,
})
