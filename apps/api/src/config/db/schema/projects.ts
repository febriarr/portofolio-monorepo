import { index, integer, pgTable, text, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { timestamps } from "./utils"
import { projectCategory } from "./projectCategory"

export const projects = pgTable(
  "projects",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    shortDescription: varchar({ length: 500 }),
    description: text("description"),
    slug: varchar({ length: 255 }).notNull(),
    liveUrl: varchar("live_url", { length: 255 }),
    linkRepo: varchar("link_repo", { length: 255 }),
    categoryId: integer("category_id").references(() => projectCategory.id),
    thumbnailUrl: varchar("thumbnail_url"),
    ...timestamps,
  },
  (table) => ({
    titleIdx: uniqueIndex("projects_title_idx").on(table.title),
    categoryIdx: index("projects_category_idx").on(table.categoryId),
    slugIdx: uniqueIndex("project_slug_idx").on(table.slug),
  })
)

export const projectImages = pgTable(
  "project_images",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer().references(() => projects.id),
    imageUrl: varchar("image_url", { length: 255 }),
    ...timestamps,
  },
  (table) => [
    index("project_images_project_id_idx").on(table.projectId), // untuk JOIN images
  ]
)
