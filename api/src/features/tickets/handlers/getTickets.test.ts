import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { describe, expect, it } from "vitest";

import { HTTP_STATUS } from "../../../common/constants/http";
import { getTicketsHandler } from "./getTickets";

function buildEvent(search?: string): APIGatewayProxyEventV2 {
  return {
    version: "2.0",
    routeKey: "GET /tickets",
    rawPath: "/tickets",
    rawQueryString: search ? `search=${encodeURIComponent(search)}` : "",
    headers: {},
    queryStringParameters: search !== undefined ? { search } : undefined,
    requestContext: {
      accountId: "local",
      apiId: "local",
      domainName: "localhost",
      domainPrefix: "localhost",
      http: {
        method: "GET",
        path: "/tickets",
        protocol: "HTTP/1.1",
        sourceIp: "127.0.0.1",
        userAgent: "vitest",
      },
      requestId: "req-test-123",
      routeKey: "GET /tickets",
      stage: "$default",
      time: new Date().toISOString(),
      timeEpoch: Date.now(),
    },
    isBase64Encoded: false,
  };
}

describe("getTicketsHandler", () => {
  it("returns 200 with ticket payload for valid search", async () => {
    const result = await getTicketsHandler(buildEvent("ava"));
    const payload = JSON.parse(result.body ?? "{}");

    expect(result.statusCode).toBe(HTTP_STATUS.OK);
    expect(result.headers?.["X-Request-Id"]).toBe("req-test-123");
    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.meta?.search).toBe("ava");
  });

  it("returns 400 with requestId and validation details for invalid search", async () => {
    const result = await getTicketsHandler(buildEvent("a"));
    const payload = JSON.parse(result.body ?? "{}");

    expect(result.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(result.headers?.["X-Request-Id"]).toBe("req-test-123");
    expect(payload.message).toBe("Invalid query parameters");
    expect(payload.requestId).toBe("req-test-123");
    expect(Array.isArray(payload.details?.issues)).toBe(true);
  });
});
