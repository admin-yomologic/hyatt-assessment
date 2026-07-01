import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

import { createValidatedLambdaHandler } from "../../../common/http/createLambdaHandler";
import { getTickets } from "../services/ticketsService";
import { ticketsSearchValidator } from "../validators/ticketsSearchValidator";

export const getTicketsHandler: (
  event: APIGatewayProxyEventV2,
) => Promise<APIGatewayProxyStructuredResultV2> = createValidatedLambdaHandler({
  validator: ticketsSearchValidator,
  service: getTickets,
});
