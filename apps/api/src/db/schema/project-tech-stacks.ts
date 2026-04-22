import { integer, pgTable } from "drizzle-orm/pg-core"
import { techStack } from "./tech-stack"
import { projects } from "./projects"

export const projectTechStacks = pgTable("project_tech_stacks", {
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  techStackId: integer("tech_stack_id")
    .notNull()
    .references(() => techStack.id),
})
