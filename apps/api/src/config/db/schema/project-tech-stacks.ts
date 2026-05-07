import { index, integer, pgTable } from "drizzle-orm/pg-core"
import { techStack } from "./tech-stack"
import { projects } from "./projects"

export const projectTechStacks = pgTable(
  "project_tech_stacks",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
    techStackId: integer("tech_stack_id")
      .notNull()
      .references(() => techStack.id),
  },
  (table) => ({
    techStackIdx: index("pts_tech_stack_idx").on(table.techStackId),
    projectIdx: index("pts_project_idx").on(table.projectId),
  })
)
