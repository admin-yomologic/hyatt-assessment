import type { Ticket } from "@/types/ticket";

const createdDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

type TicketsTableMobileProps = {
  tickets: Ticket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: Ticket) => void;
};

export function TicketsTableMobile({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: TicketsTableMobileProps) {
  return (
    <div className="grid gap-3 md:hidden">
      {tickets.map((ticket) => {
        const isSelected = selectedTicketId === ticket.id;

        return (
          <button
            key={ticket.id}
            type="button"
            className="w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-state={isSelected ? "selected" : undefined}
            onClick={() => onSelectTicket(ticket)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  {ticket.id}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-foreground">
                  {ticket.subject}
                </h3>
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {ticket.priority}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Requester
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {ticket.requester}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {ticket.status}
                </p>
              </div>
            </div>

            <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
              Created{" "}
              {createdDateFormatter.format(new Date(ticket.createdDate))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
