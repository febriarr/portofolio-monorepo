import type { Response } from "express"

interface SuccessResponseOptions<T> {
  res: Response
  data?: T
  message?: string
  statusCode?: number
  meta?: Record<string, unknown>
}

export const successResponse = <T>({
  res,
  data,
  message = "Success",
  statusCode = 200,
  meta,
}: SuccessResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  })
}
