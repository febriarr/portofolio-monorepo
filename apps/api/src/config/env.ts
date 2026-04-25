import { config } from "dotenv"

import { z } from "zod"

config()

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  PORT: z.coerce.number(),

  DATABASE_URL: z.string().min(1),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables")

  console.error(parsedEnv.error.flatten().fieldErrors)

  process.exit(1)
}

export const env = parsedEnv.data
