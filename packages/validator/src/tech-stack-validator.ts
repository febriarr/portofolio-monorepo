import { z } from "zod"
import { timeStampsSchema } from "./utils.js"
import { projectSchema } from "./projects-validator.js"

export const createTechStackSchema = z.object({
  name: z.string(),
  techCategoryId: z.string().nullish(),
  logo: z.string().nullish(),
})

export const updateTechStackSchema = createTechStackSchema.partial()

export const createTechCategorySchema = z.object({
  name: z.string(),
})

export const updateCategorySchema = createTechCategorySchema.partial()

export const techCategorySchema = z.object({
  id: z.number().int(),
  ...timeStampsSchema.shape,
  ...createTechCategorySchema.shape,
})

export const techStackSchema = z.object({
  id: z.number().int(),
  ...timeStampsSchema.shape,
  ...createTechStackSchema.shape,
})

export const techStacksDetailSchema = z.object({
  ...techStackSchema.shape,
  category: techCategorySchema,
  projects: z.array(projectSchema),
})

//Tech Stacks
export type CreateTechStack = z.infer<typeof createTechStackSchema>
export type UpdateTechStack = z.infer<typeof updateTechStackSchema>
export type TechStack = z.infer<typeof techStackSchema>
export type TechStacksDetail = z.infer<typeof techStacksDetailSchema>
//Tech Categories
export type CreateTechCategory = z.infer<typeof createTechCategorySchema>
export type UpdateTechCategory = z.infer<typeof createTechCategorySchema>
export type TechCategory = z.infer<typeof techCategorySchema>
