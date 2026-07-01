"use client";

import * as React from "react";
import type { SortingState } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Ticket } from "@/types/ticket";

import { TicketsTableDesktop } from "./tickets-table-desktop";
import { TicketsTableMobile } from "./tickets-table-mobile";
import { ticketColumnDefs } from "../lib/ticket-column-defs";

type TicketsTableProps = {
  tickets: Ticket[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: Ticket) => void;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
};

export function TicketsTable({
  tickets,
  selectedTicketId,
  onSelectTicket,
  sorting,
  onSortingChange,
}: TicketsTableProps) {
  const table = useReactTable({
    data: tickets,
    columns: ticketColumnDefs,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <TicketsTableMobile
        tickets={table.getRowModel().rows.map((row) => row.original)}
        selectedTicketId={selectedTicketId}
        onSelectTicket={onSelectTicket}
      />
      <TicketsTableDesktop
        table={table}
        selectedTicketId={selectedTicketId}
        onSelectTicket={onSelectTicket}
      />
    </>
  );
}
