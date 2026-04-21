import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { techCategory } from "./tech-category"
import { timestamps } from "./utils"

export const techStack = pgTable("tech_stack", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 64 }).notNull(),
  techCategoriesId: integer("tech_categories_id").references(() => techCategory.id),
  logo: varchar({ length: 255 }),
  ...timestamps,
})
