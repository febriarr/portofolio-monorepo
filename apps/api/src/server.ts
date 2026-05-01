import { app } from "@/config/app"

import { env } from "@/config/env"

const PORT = env.PORT ?? 8000

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...")

  server.close(() => {
    process.exit(0)
  })
})
