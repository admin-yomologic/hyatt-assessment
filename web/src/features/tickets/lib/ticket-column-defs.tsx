import type { ColumnDef } from "@tanstack/react-table";

import type { Ticket } from "@/types/ticket";

import { ColumnHeader } from "../components/table-column-header";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const ticketColumnDefs: ColumnDef<Ticket>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.getValue("id")}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    enableSorting: false,
  },
  {
    accessorKey: "requester",
    header: "Requester",
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status"),
    enableSorting: false,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <ColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => row.getValue("priority"),
    sortingFn: (a, b) => {
      const priorityOrder: Record<Ticket["priority"], number> = {
        Low: 1,
        Medium: 2,
        High: 3,
        Urgent: 4,
      };

      return (
        priorityOrder[a.original.priority] - priorityOrder[b.original.priority]
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) =>
      dateFormatter.format(new Date(row.getValue<string>("createdDate"))),
    sortingFn: (a, b) => {
      return (
        new Date(a.original.createdDate).getTime() -
        new Date(b.original.createdDate).getTime()
      );
    },
  },
];
