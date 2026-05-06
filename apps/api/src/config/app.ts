import express, { type Express } from "express"
import { notFoundMiddleware } from "@/middlewares/not-found.middleware"
import { errorsMiddleware } from "@/middlewares/errors.middleware"
import routes from "../routes/index"
import cors from "cors"
import { httpLogger } from "@/middlewares/http-logger.middleware"

const app: Express = express()

app.use(httpLogger)

app.use(express.json())

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
// routes
app.use("/api", routes)
// errors
app.use(notFoundMiddleware)
app.use(errorsMiddleware)

export { app }
