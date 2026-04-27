export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}

export interface ApiResponseWithPaginate<T = unknown> extends ApiResponse<T[]> {
  meta: {
    total: number
    page: number
    limit: number
  }
}
