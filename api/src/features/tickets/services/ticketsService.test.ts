import { describe, expect, it } from "vitest";

import { filterTickets, getTickets } from "./ticketsService";

describe("ticketsService", () => {
  it("returns all tickets when search is empty", () => {
    const allTickets = filterTickets("");
    const whitespaceSearch = filterTickets("   ");

    expect(allTickets.length).toBeGreaterThan(0);
    expect(whitespaceSearch.length).toBe(allTickets.length);
  });

  it("filters by requester or subject case-insensitively", () => {
    const requesterMatches = filterTickets("ava");
    const subjectMatches = filterTickets("vpn");

    expect(
      requesterMatches.some((ticket) =>
        ticket.requester.toLowerCase().includes("ava"),
      ),
    ).toBe(true);

    expect(
      subjectMatches.some((ticket) =>
        ticket.subject.toLowerCase().includes("vpn"),
      ),
    ).toBe(true);
  });

  it("returns response meta aligned with filtered result", () => {
    const response = getTickets("ava");

    expect(response.meta.search).toBe("ava");
    expect(response.meta.total).toBe(response.data.length);
  });
});
