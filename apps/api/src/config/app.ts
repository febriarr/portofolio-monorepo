import express, { type Express } from "express"
import { notFoundMiddleware } from "@/middlewares/not-found.middleware"
import { errorsMiddleware } from "@/middlewares/errors.middleware"
import routes from "../routes/index"

const app: Express = express()
app.use(express.json())

// routes
app.use("/api", routes)
// errors
app.use(notFoundMiddleware)
app.use(errorsMiddleware)

export { app }
