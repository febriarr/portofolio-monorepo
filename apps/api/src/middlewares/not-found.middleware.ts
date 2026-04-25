import type { Request, Response, NextFunction } from "express"
import { NotFoundError } from "@/shared/errors/custom-error"

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`))
}
