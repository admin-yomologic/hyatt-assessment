import { getAllTickets } from "../repositories/ticketsRepository";
import type { GetTicketsResponse, Ticket } from "../types/ticket";

export function filterTickets(rawSearch = ""): Ticket[] {
  const search = rawSearch.trim().toLowerCase();
  const tickets = getAllTickets();

  if (!search) {
    return tickets;
  }

  return tickets.filter((ticket) => {
    return (
      ticket.subject.toLowerCase().includes(search) ||
      ticket.requester.toLowerCase().includes(search)
    );
  });
}

export function getTickets(rawSearch = ""): GetTicketsResponse {
  const filteredTickets = filterTickets(rawSearch);

  return {
    data: filteredTickets,
    meta: {
      total: filteredTickets.length,
      search: rawSearch,
    },
  };
}
