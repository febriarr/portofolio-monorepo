import express, { type Express } from "express"
import { notFoundMiddleware } from "@/middlewares/not-found.middleware"
import { errorsMiddleware } from "@/middlewares/errors.middleware"

const app: Express = express()
app.use(express.json())

// errors
app.use(notFoundMiddleware)
app.use(errorsMiddleware)

export { app }
