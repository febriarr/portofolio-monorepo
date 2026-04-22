import { z } from "zod"

export const timeStampsSchema = z.object({
  created_at: z.date(),
  updated_at: z.date(),
  deleted_at: z.date(),
})
