export interface ErrorResponseType {
  code: string
  message: string | string[]
  field?: (string | number)[][] | null
  details?: unknown
  statusCode: number | null
}
