import { z } from "zod"

export const createProjectImages = z.object({
  projectId: z.coerce.number().int().positive().nullish(),
  imageUrl: z.string().min(5).nullish(),
})

export const updateProjectImages = createProjectImages

export const createProjectCategorySchema = z.object({
  name: z.string(),
})

export const updateProjectCategorySchema = createProjectCategorySchema.partial()

export const createProjectSchema = z.object({
  title: z.string(),
  shortDescription: z.string().min(5).nullish(),
  description: z.string().min(5).nullish(),
  liveUrl: z.string().min(5).nullish(),
  linkRepo: z.string().min(5).nullish(),
  categoryId: z.number().int().positive().nullish(),
  images: z.array(createProjectImages).optional(),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  deletedImagePaths: z
    .array(
      z
        .string()
        .min(1)
        .refine((p) => !p.includes(".."), {
          message: 'Path cannot contain ".."',
        })
    )
    .optional(),
})

// project Images
export type CreateProjectImages = z.infer<typeof createProjectImages>
export type UpdateProjectImages = z.infer<typeof updateProjectImages>
// Project Categories
export type CreateProjectCategory = z.infer<typeof createProjectCategorySchema>
export type UpdateProjectCategory = z.infer<typeof updateProjectCategorySchema>
// Projects
export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
