import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { BaseError } from "@/shared/errors/custom-error"

export const errorsMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json(error.getErrorResponse())
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: error.issues.map((issue) => issue.message).join(","),
      field: error.issues.map((issue) => issue.path).join(","),
      details: error.flatten(),
      statusCode: 400,
    })
  }
  console.error(error)
  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error",
    statusCode: 500,
  })
}
