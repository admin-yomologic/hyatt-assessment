import type { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

import { HTTP_STATUS } from "../constants/http";

type ResponseMeta = {
  requestId?: string;
};

function getDefaultHeaders(): Record<string, string> {
  const allowedOrigin = process.env.API_CORS_ORIGIN ?? "*";

  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    ...(allowedOrigin === "*" ? {} : { Vary: "Origin" }),
  };
}

// Central response builder used by all handlers to keep header/payload shape consistent.
export function jsonResponse(
  statusCode: number,
  payload: unknown,
  meta?: ResponseMeta,
): APIGatewayProxyStructuredResultV2 {
  const headers = {
    ...getDefaultHeaders(),
    ...(meta?.requestId ? { "X-Request-Id": meta.requestId } : {}),
  };

  return {
    statusCode,
    headers,
    body: JSON.stringify(payload),
  };
}

// Standard 200 JSON response.
export function successResponse(
  payload: unknown,
  meta?: ResponseMeta,
): APIGatewayProxyStructuredResultV2 {
  return jsonResponse(HTTP_STATUS.OK, payload, meta);
}

// Standard error payload with optional machine-readable details for clients.
export function errorResponse(
  statusCode: number,
  message: string,
  details?: Record<string, unknown>,
  meta?: ResponseMeta,
): APIGatewayProxyStructuredResultV2 {
  return jsonResponse(
    statusCode,
    {
      message,
      ...(meta?.requestId ? { requestId: meta.requestId } : {}),
      ...(details ? { details } : {}),
    },
    meta,
  );
}
