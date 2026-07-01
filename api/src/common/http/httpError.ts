// Domain/validation errors that should map to controlled HTTP responses.
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

// Narrow unknown errors inside wrappers so only intended errors expose custom status/details.
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
