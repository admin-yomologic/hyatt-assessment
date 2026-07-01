import { createServer } from "node:http";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { HTTP_ERROR_MESSAGE, HTTP_STATUS } from "../constants/http";
import { logError } from "../logging/logger";
import { errorResponse } from "./response";

type LambdaHandler = (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyStructuredResultV2>;

type LambdaRoute = {
  method: string;
  path: string;
  handler: LambdaHandler;
};

// Small interface used to avoid runtime coupling to Node's complex response type signatures.
type ResponseWriter = {
  writeHead: (
    statusCode: number,
    headers?: Record<string, string> | undefined,
  ) => void;
  end: (body?: string) => void;
};

function normalizeHeaders(
  headers: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(headers)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(",") : value,
      ]),
  );
}

// Write API Gateway-style Lambda output back to Node HTTP response.
function writeLambdaResult(
  res: ResponseWriter,
  result: APIGatewayProxyStructuredResultV2,
) {
  res.writeHead(
    result.statusCode ?? 200,
    result.headers as Record<string, string> | undefined,
  );
  res.end(result.body ?? "");
}

// Local adapter that routes Node HTTP requests to Lambda handlers.
// Purpose: fast local development while exercising the same handler wrappers used in production.
export function startLocalLambdaRouter(port: number, routes: LambdaRoute[]) {
  const routeMap = new Map<string, LambdaHandler>(
    routes.map((route) => [
      `${route.method.toUpperCase()} ${route.path}`,
      route.handler,
    ]),
  );

  const server = createServer(async (req, res) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (!req.url) {
      writeLambdaResult(
        res,
        errorResponse(
          HTTP_STATUS.BAD_REQUEST,
          HTTP_ERROR_MESSAGE.MISSING_REQUEST_URL,
          undefined,
          { requestId },
        ),
      );
      return;
    }

    const requestUrl = new URL(req.url, `http://localhost:${port}`);
    const method = (req.method ?? "GET").toUpperCase();
    const routeKey = `${method} ${requestUrl.pathname}`;
    const routeHandler = routeMap.get(routeKey);

    if (!routeHandler) {
      writeLambdaResult(
        res,
        errorResponse(
          HTTP_STATUS.NOT_FOUND,
          HTTP_ERROR_MESSAGE.NOT_FOUND,
          undefined,
          { requestId },
        ),
      );
      return;
    }

    const query = Object.fromEntries(requestUrl.searchParams.entries());

    // Build a minimal API Gateway v2-like event so handlers can run unmodified locally.
    const event = {
      version: "2.0",
      routeKey,
      rawPath: requestUrl.pathname,
      rawQueryString: requestUrl.searchParams.toString(),
      headers: normalizeHeaders(req.headers),
      queryStringParameters: Object.keys(query).length > 0 ? query : undefined,
      requestContext: {
        accountId: "local",
        apiId: "local",
        domainName: "localhost",
        domainPrefix: "localhost",
        http: {
          method,
          path: requestUrl.pathname,
          protocol: "HTTP/1.1",
          sourceIp: req.socket.remoteAddress ?? "127.0.0.1",
          userAgent: req.headers["user-agent"] ?? "local",
        },
        requestId,
        routeKey,
        stage: "$default",
        time: new Date().toISOString(),
        timeEpoch: Date.now(),
      },
      isBase64Encoded: false,
    } as APIGatewayProxyEventV2;

    try {
      const result = await routeHandler(event);
      writeLambdaResult(res, result);
    } catch (error) {
      const unknownError =
        error instanceof Error ? error : new Error(String(error));

      logError("Local router unhandled handler error", {
        requestId,
        routeKey,
        path: requestUrl.pathname,
        name: unknownError.name,
        message: unknownError.message,
        stack: unknownError.stack,
      });

      writeLambdaResult(
        res,
        errorResponse(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          HTTP_ERROR_MESSAGE.UNEXPECTED_SERVER_ERROR,
          undefined,
          { requestId },
        ),
      );
    }
  });

  server.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });

  return server;
}
