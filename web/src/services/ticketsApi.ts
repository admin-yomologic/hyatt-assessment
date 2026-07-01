import type { GetTicketsResponse } from "../types/ticket";

export async function getTickets(search?: string): Promise<GetTicketsResponse> {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();
  const endpoint = query ? `/tickets?${query}` : "/tickets";

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.status}`);
  }

  return (await response.json()) as GetTicketsResponse;
}
