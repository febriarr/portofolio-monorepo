import { z } from "zod"
import { timeStampsSchema } from "./utils.js"
import { techStackSchema } from "./tech-stack-validator.js"

export const createProjectImages = z.object({
  projectId: z.coerce.number().int().positive(),
  imageUrl: z.string().min(5).nullish(),
})

export const updateProjectImages = createProjectImages

export const projectImagesSchema = z.object({
  id: z.number().int().positive(),
  ...createProjectImages.shape,
  ...timeStampsSchema.shape,
})

export const createProjectCategorySchema = z.object({
  name: z.string(),
})

export const updateProjectCategorySchema = createProjectCategorySchema.partial()

export const projectCategorySchema = z.object({
  id: z.number().int(),
  ...timeStampsSchema.shape,
  ...createProjectCategorySchema.shape,
})

export const createProjectSchema = z.object({
  title: z.string(),
  shortDescription: z.string().min(5).nullish(),
  description: z.string().min(5).nullish(),
  liveUrl: z.string().min(5).nullish(),
  linkRepo: z.string().min(5).nullish(),
  categoryId: z.string(),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectSchema = z.object({
  id: z.number().int(),
  ...timeStampsSchema.shape,
  ...createProjectSchema.shape,
})

export const projectDetailSchema = z.object({
  ...projectSchema.shape,
  images: z.array(projectImagesSchema),
  techStacks: z.array(techStackSchema),
  category: z.array(projectCategorySchema),
})

// project Images
export type CreateProjectImages = z.infer<typeof createProjectImages>
export type UpdateProjectImages = z.infer<typeof updateProjectImages>
export type ProjectImages = z.infer<typeof projectImagesSchema>
// Project Categories
export type CreateProjectCategory = z.infer<typeof createProjectCategorySchema>
export type UpdateProjectCategory = z.infer<typeof updateProjectCategorySchema>
export type ProjectCategory = z.infer<typeof projectCategorySchema>
// Projects
export type CreateProjectSchema = z.infer<typeof createProjectSchema>
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>
export type Project = z.infer<typeof projectSchema>
export type ProjectDetail = z.infer<typeof projectDetailSchema>
