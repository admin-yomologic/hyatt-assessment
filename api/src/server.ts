import { startLocalLambdaRouter } from "./common/http/localLambdaRouter";
import { getTicketsHandler } from "./features/tickets/handlers/getTickets";

const port = 8787;

startLocalLambdaRouter(port, [
  {
    method: "GET",
    path: "/tickets",
    handler: getTicketsHandler,
  },
]);
