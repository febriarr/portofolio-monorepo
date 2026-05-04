import type { Request, Response, NextFunction } from "express"
import { NotFoundError } from "@/shared/errors/custom-error"

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`Route ${req.method} ${req.originalUrl} not found`)
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`))
}
