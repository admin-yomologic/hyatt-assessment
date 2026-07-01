export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const HTTP_ERROR_MESSAGE = {
  INVALID_REQUEST_PARAMETERS: "Invalid request parameters",
  UNEXPECTED_SERVER_ERROR: "Unexpected server error",
  MISSING_REQUEST_URL: "Missing request URL",
  NOT_FOUND: "Not found",
} as const;
