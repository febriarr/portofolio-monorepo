import { ErrorResponseType } from "./error-response-type"

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: ErrorResponseType
}

export interface ApiResponseWithPaginate<T = unknown> extends ApiResponse<T[]> {
  meta: {
    total: number
    page: number
    limit: number
  }
}
