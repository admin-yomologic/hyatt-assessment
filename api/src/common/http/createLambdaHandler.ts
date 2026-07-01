import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import type { ZodTypeAny, z } from "zod";

import { HTTP_ERROR_MESSAGE, HTTP_STATUS } from "../constants/http";
import { logError } from "../logging/logger";
import { errorResponse, successResponse } from "./response";
import { HttpError, isHttpError } from "./httpError";
import { validateSchema } from "../validation/validateSchema";

type LambdaLogic<TEvent extends APIGatewayProxyEventV2> = (
  event: TEvent,
) => Promise<unknown>;

export type LambdaValidator<
  TEvent extends APIGatewayProxyEventV2,
  TSchema extends ZodTypeAny,
  TServiceInput = z.infer<TSchema>,
> = {
  schema: TSchema;
  getPayload: (event: TEvent) => unknown;
  mapValidated?: (validated: z.infer<TSchema>, event: TEvent) => TServiceInput;
  errorMessage?: string;
};

type LambdaService<TServiceInput> = (
  serviceInput: TServiceInput,
) => Promise<unknown> | unknown;

function eventContext(event: APIGatewayProxyEventV2) {
  return {
    requestId: event.requestContext.requestId,
    routeKey: event.requestContext.routeKey,
    path: event.rawPath,
  };
}

// Base wrapper that normalizes success/error responses for all Lambda endpoints.
export function createLambdaHandler<TEvent extends APIGatewayProxyEventV2>(
  logic: LambdaLogic<TEvent>,
): (event: TEvent) => Promise<APIGatewayProxyStructuredResultV2> {
  return async (event) => {
    const requestId = event.requestContext.requestId;

    try {
      const payload = await logic(event);
      return successResponse(payload, { requestId });
    } catch (error) {
      if (isHttpError(error)) {
        if (error.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          logError("Lambda handled HttpError", {
            ...eventContext(event),
            statusCode: error.statusCode,
            message: error.message,
            details: error.details,
          });
        }

        return errorResponse(error.statusCode, error.message, error.details, {
          requestId,
        });
      }

      const unknownError =
        error instanceof Error ? error : new Error(String(error));

      logError("Lambda unhandled error", {
        ...eventContext(event),
        name: unknownError.name,
        message: unknownError.message,
        stack: unknownError.stack,
      });

      return errorResponse(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        HTTP_ERROR_MESSAGE.UNEXPECTED_SERVER_ERROR,
        undefined,
        { requestId },
      );
    }
  };
}

// Higher-level wrapper that runs validation before invoking a service function.
// This keeps endpoint handlers thin: declare validator + service, avoid repetitive boilerplate.
export function createValidatedLambdaHandler<
  TEvent extends APIGatewayProxyEventV2,
  TSchema extends ZodTypeAny,
  TServiceInput = z.infer<TSchema>,
>(options: {
  validator: LambdaValidator<TEvent, TSchema, TServiceInput>;
  service: LambdaService<TServiceInput>;
}): (event: TEvent) => Promise<APIGatewayProxyStructuredResultV2> {
  const { validator, service } = options;
  const {
    schema,
    getPayload,
    mapValidated,
    errorMessage = HTTP_ERROR_MESSAGE.INVALID_REQUEST_PARAMETERS,
  } = validator;

  return createLambdaHandler(async (event: TEvent) => {
    const validation = validateSchema(schema, getPayload(event));

    if (!validation.success) {
      // Validation failures are client errors, not unexpected server exceptions.
      throw new HttpError(HTTP_STATUS.BAD_REQUEST, errorMessage, {
        issues: validation.issues,
      });
    }

    const serviceInput = mapValidated
      ? mapValidated(validation.data, event)
      : (validation.data as TServiceInput);

    return service(serviceInput);
  });
}
