import type { FormEventHandler } from "react";
import type { SortingState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Ticket } from "@/types/ticket";

type StatusFilter = "All" | Ticket["status"];
type TicketSortValue =
  | "createdDate-desc"
  | "createdDate-asc"
  | "priority-desc"
  | "priority-asc";

function getSortValueFromState(sorting: SortingState): TicketSortValue {
  const currentSort = sorting[0];

  if (!currentSort) {
    return "createdDate-desc";
  }

  if (currentSort.id === "priority") {
    return currentSort.desc ? "priority-desc" : "priority-asc";
  }

  return currentSort.desc ? "createdDate-desc" : "createdDate-asc";
}

function getSortingStateFromValue(value: TicketSortValue): SortingState {
  const [id, direction] = value.split("-") as [
    "priority" | "createdDate",
    "asc" | "desc",
  ];

  return [{ id, desc: direction === "desc" }];
}

type TicketsSearchControlsProps = {
  searchInput: string;
  searchError?: string;
  onSearchInputChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function TicketsSearchControls({
  searchInput,
  searchError,
  onSearchInputChange,
  statusFilter,
  onStatusFilterChange,
  sorting,
  onSortingChange,
  onSubmit,
}: TicketsSearchControlsProps) {
  const selectedSortValue = getSortValueFromState(sorting);

  return (
    <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-[3fr_1fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="ticket-search">Search tickets</FieldLabel>
          <FieldDescription id="ticket-search-description">
            Search by subject, requester, or ticket details.
          </FieldDescription>
          <Input
            id="ticket-search"
            value={searchInput}
            aria-invalid={Boolean(searchError)}
            aria-describedby={
              searchError
                ? "ticket-search-description ticket-search-error"
                : undefined
            }
            onChange={(event) => onSearchInputChange(event.target.value)}
          />
          {searchError ? (
            <FieldError id="ticket-search-error">{searchError}</FieldError>
          ) : null}
        </Field>

        <Field>
          <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
          <FieldDescription>Filter tickets by workflow state.</FieldDescription>
          <Select
            id="ticket-status"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as StatusFilter)
            }
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </Select>
        </Field>

        <Field className="md:hidden sm:col-span-2">
          <FieldLabel htmlFor="ticket-sort">Sort by</FieldLabel>
          <FieldDescription>Choose how tickets are ordered.</FieldDescription>
          <Select
            id="ticket-sort"
            value={selectedSortValue}
            onChange={(event) =>
              onSortingChange(
                getSortingStateFromValue(event.target.value as TicketSortValue),
              )
            }
          >
            <option value="createdDate-desc">
              Created date (newest first)
            </option>
            <option value="createdDate-asc">Created date (oldest first)</option>
            <option value="priority-desc">Priority (highest first)</option>
            <option value="priority-asc">Priority (lowest first)</option>
          </Select>
        </Field>
      </div>

      <div className="flex items-end justify-end">
        <Button type="submit" className="h-10 w-full lg:max-w-56">
          Search
        </Button>
      </div>
    </form>
  );
}
