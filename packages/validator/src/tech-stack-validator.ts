import { z } from "zod"

export const createTechStackSchema = z.object({
  name: z.string(),
  techCategoryId: z.string().nullish(),
  logo: z.string().nullish(),
})

export const updateTechStackSchema = createTechStackSchema.partial()

export const createTechCategorySchema = z.object({
  name: z.string(),
})

export const updateTechCategorySchema = createTechCategorySchema.partial()

//Tech Stacks
export type CreateTechStack = z.infer<typeof createTechStackSchema>
export type UpdateTechStack = z.infer<typeof updateTechStackSchema>

//Tech Categories
export type CreateTechCategory = z.infer<typeof createTechCategorySchema>
export type UpdateTechCategory = z.infer<typeof updateTechCategorySchema>
