import { env } from "@/config/env"
import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/config/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_DIRECT_URL,
  },
})
