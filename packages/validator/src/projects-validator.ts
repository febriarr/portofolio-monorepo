import { z } from "zod"
import { baseFilterSchema } from "./base-filter-validator.js"

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
  shortDescription: z.string().min(5).nullish().optional(),
  description: z.string().min(5).nullish().optional(),
  liveUrl: z.string().nullish(),
  linkRepo: z.string().nullish(),
  categoryId: z.coerce.number().int().positive().nullish(),
  thumbnailUrl: z.string().min(5).nullish(),
  images: z.array(createProjectImages).optional(),
  techStackIds: z.array(z.coerce.number().int().positive()).optional(),
  slug: z.string().min(5).nullish().optional(),
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
  deletedThumbnailPath: z.string().optional(),
})

export const projectsFilterSchema = baseFilterSchema.extend({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  techStackId: z.coerce.number().int().positive().optional(),
})

export const paramsSchema = z.string()

// project Images
export type CreateProjectImages = z.infer<typeof createProjectImages>
export type UpdateProjectImages = z.infer<typeof updateProjectImages>
// Project Categories
export type CreateProjectCategory = z.infer<typeof createProjectCategorySchema>
export type UpdateProjectCategory = z.infer<typeof updateProjectCategorySchema>
// Projects
export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
//filter
export type ProjectsFilter = z.infer<typeof projectsFilterSchema>
// params
export type Params = z.infer<typeof paramsSchema>
