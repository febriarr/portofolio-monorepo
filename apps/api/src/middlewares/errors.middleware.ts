import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { BaseError } from "@/shared/errors/custom-error"
import { ErrorResponseType } from "@workspace/shared"

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
    const response: ErrorResponseType = {
      code: "VALIDATION_ERROR",
      message: error.issues.map((issue) => issue.message).join(","),
      field: error.issues.map((issue) =>
        issue.path.filter((p): p is string | number => typeof p !== "symbol")
      ),
      details: error.flatten(),
      statusCode: 400,
    }
    return res.status(400).json(response)
  }

  console.error(error)

  const response: ErrorResponseType = {
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal Server Error",
    statusCode: 500,
  }
  return res.status(500).json(response)
}
