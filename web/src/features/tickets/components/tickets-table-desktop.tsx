import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Ticket } from "@/types/ticket";

type TicketsTableDesktopProps = {
  table: TanstackTable<Ticket>;
  selectedTicketId?: string;
  onSelectTicket: (ticket: Ticket) => void;
};

export function TicketsTableDesktop({
  table,
  selectedTicketId,
  onSelectTicket,
}: TicketsTableDesktopProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const ticket = row.original;
            const selected = selectedTicketId === ticket.id;

            return (
              <TableRow
                key={row.id}
                data-state={selected ? "selected" : undefined}
                className="cursor-pointer"
                onClick={() => onSelectTicket(ticket)}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
