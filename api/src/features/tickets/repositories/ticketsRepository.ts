import { ticketsFixture } from "../../../data/tickets";
import type { Ticket } from "../types/ticket";

export function getAllTickets(): Ticket[] {
  return ticketsFixture;
}
