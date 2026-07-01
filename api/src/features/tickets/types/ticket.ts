export type TicketStatus = "Open" | "In Progress" | "Resolved";

export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export type Ticket = {
  id: string;
  subject: string;
  requester: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdDate: string;
  description: string;
};

export type GetTicketsResponse = {
  data: Ticket[];
  meta: {
    total: number;
    search: string;
  };
};
