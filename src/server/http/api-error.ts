export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

type ApiErrorOptions = {
  code: ApiErrorCode | (string & {});
  message: string;
  statusCode: number;
  details?: unknown;
  expose?: boolean;
};

export class ApiError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly expose: boolean;
  readonly statusCode: number;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = "ApiError";
    this.code = options.code;
    this.details = options.details;
    this.statusCode = options.statusCode;
    this.expose = options.expose ?? options.statusCode < 500;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export const apiErrors = {
  badRequest(message = "Bad request.", details?: unknown) {
    return new ApiError({
      code: "BAD_REQUEST",
      details,
      message,
      statusCode: 400,
    });
  },

  unauthorized(message = "Authentication is required.", details?: unknown) {
    return new ApiError({
      code: "UNAUTHORIZED",
      details,
      message,
      statusCode: 401,
    });
  },

  forbidden(message = "You do not have permission to access this resource.", details?: unknown) {
    return new ApiError({
      code: "FORBIDDEN",
      details,
      message,
      statusCode: 403,
    });
  },

  notFound(message = "Resource not found.", details?: unknown) {
    return new ApiError({
      code: "NOT_FOUND",
      details,
      message,
      statusCode: 404,
    });
  },

  conflict(message = "Resource conflict.", details?: unknown) {
    return new ApiError({
      code: "CONFLICT",
      details,
      message,
      statusCode: 409,
    });
  },

  validation(message = "Validation failed.", details?: unknown) {
    return new ApiError({
      code: "VALIDATION_ERROR",
      details,
      message,
      statusCode: 422,
    });
  },
};
