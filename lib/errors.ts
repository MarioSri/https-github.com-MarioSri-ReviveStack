export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403)
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return Response.json({ error: error.message }, { status: error.statusCode })
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "P2002":
        return Response.json({ error: "A record with this information already exists" }, { status: 409 })
      case "P2025":
        return Response.json({ error: "Record not found" }, { status: 404 })
      default:
        return Response.json({ error: "Database error occurred" }, { status: 500 })
    }
  }

  // Generic error
  return Response.json({ error: "Internal server error" }, { status: 500 })
}
