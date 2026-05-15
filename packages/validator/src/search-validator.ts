import { z } from "zod"

export const searchSchema = z.string()

export type Search = z.infer<typeof searchSchema>
