import { integer, pgTable, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "./utils"
import { projectCategory } from "./projectCategory"

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  shortDescription: varchar({ length: 500 }),
  description: varchar(),
  liveUrl: varchar("live_url", { length: 255 }),
  linkRepo: varchar("link_repo", { length: 255 }),
  categoryId: integer("category_id").references(() => projectCategory.id),
  ...timestamps,
})

export const projectImages = pgTable("project_images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer().references(() => projects.id),
  imageUrl: varchar("image_url", { length: 255 }),
  ...timestamps,
})
