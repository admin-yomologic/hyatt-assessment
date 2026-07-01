import type { APIGatewayProxyEventV2 } from "aws-lambda";

import type { LambdaValidator } from "../../../common/http/createLambdaHandler";
import { ticketsQuerySchema } from "../schemas/ticketsQuerySchema";

export const ticketsSearchValidator: LambdaValidator<
  APIGatewayProxyEventV2,
  typeof ticketsQuerySchema,
  string
> = {
  schema: ticketsQuerySchema,
  getPayload: (event) => event.queryStringParameters ?? {},
  mapValidated: (validated) => validated.search,
  errorMessage: "Invalid query parameters",
};
