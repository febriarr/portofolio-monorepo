import express, { type Express } from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"

import routes from "../routes/index"

import { httpLogger } from "@/middlewares/http-logger.middleware"
import { notFoundMiddleware } from "@/middlewares/not-found.middleware"
import { errorsMiddleware } from "@/middlewares/errors.middleware"

const app: Express = express()

// security
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production",
    crossOriginEmbedderPolicy: false,
  })
)

// cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

// logger
app.use(httpLogger)

// parsers
app.use(express.json())
app.use(cookieParser())

// routes
app.use("/api", routes)

// errors
app.use(notFoundMiddleware)
app.use(errorsMiddleware)

export { app }
