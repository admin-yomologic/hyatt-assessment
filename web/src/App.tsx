import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { TicketsSearchControls } from "./features/tickets/components/tickets-search-controls";
import {
  composeValidators,
  maxLength,
  normalizeWhitespace,
  optionalMinLength,
} from "./lib/validation";
import { TicketsTable } from "./features/tickets/components/table-tickets";
import { getTickets } from "./services/ticketsApi";
import type { Ticket } from "./types/ticket";

type StatusFilter = "All" | Ticket["status"];

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const validateSearchTerm = composeValidators(
  maxLength(120, "Search can be up to 120 characters."),
  optionalMinLength(2, "Use at least 2 characters to narrow results."),
);

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdDate", desc: true },
  ]);

  const ticketsQuery = useQuery({
    queryKey: ["tickets", searchTerm],
    queryFn: () => getTickets(searchTerm),
  });

  const visibleTickets = useMemo(() => {
    const rawTickets = ticketsQuery.data?.data ?? [];

    return rawTickets.filter((ticket) => {
      if (statusFilter === "All") {
        return true;
      }

      return ticket.status === statusFilter;
    });
  }, [ticketsQuery.data?.data, statusFilter]);

  const onSearchSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const normalizedSearchTerm = normalizeWhitespace(searchInput);
    const validationError = validateSearchTerm(normalizedSearchTerm);

    if (validationError) {
      setSearchError(validationError);
      return;
    }

    setSearchError(undefined);
    setSearchInput(normalizedSearchTerm);
    setSearchTerm(normalizedSearchTerm);
  };

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="app-hero">
          <p className="app-eyebrow">Support Hub</p>
          <h1 className="app-title">Support Tickets</h1>
          <p className="app-subtitle">
            Track customer requests, prioritize urgent issues, and review ticket
            details in a single workspace.
          </p>
        </header>

        <section className="app-panel">
          <TicketsSearchControls
            searchInput={searchInput}
            searchError={searchError}
            onSearchInputChange={(value) => {
              setSearchInput(value);
              if (searchError) {
                setSearchError(undefined);
              }
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sorting={sorting}
            onSortingChange={setSorting}
            onSubmit={onSearchSubmit}
          />
        </section>

        <section className="space-y-4">
          {ticketsQuery.isPending ? (
            <div className="app-state-box">Loading tickets...</div>
          ) : null}

          {ticketsQuery.isError ? (
            <div className="app-state-box app-state-box-error p-6">
              Error loading tickets: {(ticketsQuery.error as Error).message}
            </div>
          ) : null}

          {ticketsQuery.isSuccess ? (
            visibleTickets.length > 0 ? (
              <TicketsTable
                tickets={visibleTickets}
                selectedTicketId={selectedTicket?.id}
                onSelectTicket={setSelectedTicket}
                sorting={sorting}
                onSortingChange={setSorting}
              />
            ) : (
              <div className="app-state-box">
                No tickets match your current filters.
              </div>
            )
          ) : null}
        </section>
      </div>

      <Dialog
        open={Boolean(selectedTicket)}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <DialogContent>
          {selectedTicket ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTicket.subject}</DialogTitle>
                <DialogDescription>
                  {selectedTicket.id} | {selectedTicket.requester}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="app-detail-card">
                  <p className="app-detail-label">Status</p>
                  <p className="app-detail-value">{selectedTicket.status}</p>
                </div>
                <div className="app-detail-card">
                  <p className="app-detail-label">Priority</p>
                  <p className="app-detail-value">{selectedTicket.priority}</p>
                </div>
                <div className="app-detail-card sm:col-span-2">
                  <p className="app-detail-label">Created</p>
                  <p className="app-detail-value">
                    {dateTimeFormatter.format(
                      new Date(selectedTicket.createdDate),
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 app-detail-card p-4">
                <p className="app-detail-label">Description</p>
                <p className="mt-2 leading-6 text-foreground/90">
                  {selectedTicket.description}
                </p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default App;
