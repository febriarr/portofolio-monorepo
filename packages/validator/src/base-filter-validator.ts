import { z } from "zod"

export const baseFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(6),
})

export type BaseFilter = z.infer<typeof baseFilterSchema>
