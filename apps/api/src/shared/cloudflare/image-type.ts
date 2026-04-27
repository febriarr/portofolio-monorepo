import { z } from "zod"
import { UploadedFile } from "@workspace/shared"

export const commonOptionsSchema = z.object({
  bucket: z.string().min(1).optional(),
  prefix: z
    .string()
    .optional()
    .refine((p) => !p || !p.includes(".."), {
      message: 'Prefix cannot contain ".."',
    }),
  allowedMimeTypes: z.array(z.string()).optional(),
  maxBytes: z.number().int().positive().optional(),
})

export type CommonOptionsType = z.infer<typeof commonOptionsSchema>

export const createImageSchema = z.object({
  file: z.custom<UploadedFile>((v) => !!v && typeof v === "object" && "buffer" in (v as any), {
    message: "File must be a valid Express.Multer.File object",
  }),
  options: commonOptionsSchema.optional(),
})

export const deleteImageSchema = z.object({
  path: z
    .string()
    .min(1)
    .refine((p) => !p.includes(".."), {
      message: 'Path cannot contain ".."',
    }),
  bucket: z.string().min(1).optional(),
})

export type CreateImageInput = z.infer<typeof createImageSchema>
export type DeleteImageInput = z.infer<typeof deleteImageSchema>

export const updateImageSchema = z.object({
  newFile: z.custom<UploadedFile>((v) => !!v && typeof v === "object" && "buffer" in (v as any), {
    message: "New file must be a valid Express.Multer.File object",
  }),
  oldPath: z
    .string()
    .min(1)
    .refine((p) => !p.includes(".."), {
      message: 'Old path cannot contain ".."',
    })
    .optional(),
  deletetOld: z.boolean().default(true),
  options: commonOptionsSchema.optional(),
})

export type UpdateImageInput = z.infer<typeof updateImageSchema>

export type ListedImage = {
  name: string
  path: string
  url: string
  updatedAt?: string | null
  metadata?: Record<string, any> | null
}

export type ImageResult = {
  path: string
  meta: {
    fileName: string
    mimeType: string
    size: number
  }
}
