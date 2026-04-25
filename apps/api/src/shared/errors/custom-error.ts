import type { ErrorResponseType } from "@workspace/shared"

export abstract class BaseError extends Error {
  public readonly code: string

  public readonly statusCode: number

  public readonly field?: (string | number)[][] | null

  public readonly details?: unknown

  public readonly errorMessage: string | string[]

  constructor(
    code: string,
    statusCode: number,
    message: string | string[],
    field?: (string | number)[][] | null,
    details?: unknown
  ) {
    super(Array.isArray(message) ? message.join(", ") : message)

    this.code = code

    this.statusCode = statusCode

    this.errorMessage = message

    this.field = field

    this.details = details

    Object.setPrototypeOf(this, new.target.prototype)
  }

  getErrorResponse(): ErrorResponseType {
    return {
      code: this.code,
      message: this.errorMessage,
      field: this.field,
      details: this.details,
      statusCode: this.statusCode,
    }
  }
}

export class AuthenticationError extends BaseError {
  constructor(message: string | string[] = "Authentication failed", details?: unknown) {
    super("AUTHENTICATION_ERROR", 401, message, null, details)
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string | string[] = "Access denied", details?: unknown) {
    super("FORBIDDEN_ERROR", 403, message, null, details)
  }
}

export class ConflictError extends BaseError {
  constructor(message: string | string[] = "Conflict occurred", details?: unknown) {
    super("CONFLICT_ERROR", 409, message, null, details)
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string | string[] = "Resource not found", details?: unknown) {
    super("NOT_FOUND_ERROR", 404, message, null, details)
  }
}
