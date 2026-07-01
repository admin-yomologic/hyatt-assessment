import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

type ColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export function ColumnHeader<TData, TValue>({
  column,
  title,
}: ColumnHeaderProps<TData, TValue>) {
  const isSorted = column.getIsSorted();
  const nextDirection = isSorted === "asc" ? "descending" : "ascending";
  const Icon =
    isSorted === "asc"
      ? ArrowUp
      : isSorted === "desc"
        ? ArrowDown
        : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 cursor-pointer gap-1 px-2 font-medium"
      aria-label={`Sort ${title} ${nextDirection}`}
      data-sorted={isSorted ? "true" : "false"}
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      <span>{title}</span>
      <Icon className="h-4 w-4 opacity-80" />
    </Button>
  );
}
