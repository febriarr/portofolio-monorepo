import { relations } from "drizzle-orm"
import { projectCategory } from "./projectCategory"
import { projectImages, projects } from "./projects"
import { techStack } from "./tech-stack"
import { techCategory } from "./tech-category"
import { projectTechStacks } from "./project-tech-stacks"

export const projectCategoryRelations = relations(projectCategory, ({ many }) => ({
  projects: many(projects),
}))

// techCategory → one-to-many ke techStack
export const techCategoryRelations = relations(techCategory, ({ many }) => ({
  techStacks: many(techStack),
}))

// techStack → many-to-one ke techCategory, many-to-many ke projects
export const techStackRelations = relations(techStack, ({ one, many }) => ({
  category: one(techCategory, {
    fields: [techStack.techCategoryId],
    references: [techCategory.id],
  }),
  projects: many(projectTechStacks),
}))

// projects → many-to-one ke projectCategory, many-to-many ke techStack, one-to-many ke images
export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(projectCategory, {
    fields: [projects.categoryId],
    references: [projectCategory.id],
  }),
  techStacks: many(projectTechStacks),
  images: many(projectImages),
}))

// pivot
export const projectTechStacksRelations = relations(projectTechStacks, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechStacks.projectId],
    references: [projects.id],
  }),
  techStack: one(techStack, {
    fields: [projectTechStacks.techStackId],
    references: [techStack.id],
  }),
}))

// projectImages → many-to-one ke projects
export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}))
