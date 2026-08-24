"use client";

import { MoreHorizontal } from "lucide-react";
import type {
  Column,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import { SortableColumn } from "@/components/sortable-column";
import { tableFeaturesConfig } from "@/lib/table-features";

import type { AdWidget } from "../page";

type AdsWidgetsTableAction = {
  setType: (type: "add" | "edit") => void;

  onEdit: (value: boolean) => void;
  onView: (value: boolean) => void;
  onDelete: (value: boolean) => void;
  setAdWidget: (adWidget: AdWidget) => void;
  setTypeDelete: (type: "single" | "many") => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

type AdWidgetColumn = Column<typeof tableFeaturesConfig, AdWidget, unknown>;

function AdWidgetSortableColumn({
  column,
  title,
}: {
  column: AdWidgetColumn;
  title: string;
}) {
  return (
    <SortableColumn
      title={title}
      sorted={column.getIsSorted()}
      onSort={column.getToggleSortingHandler()}
    />
  );
}

export const getColumns = ({
  onEdit,
  onView,
  onDelete,
  setAdWidget,
  setType,
  setSelectedIds,
  setTypeDelete,
  setRowSelection,
}: AdsWidgetsTableAction): ColumnDef<
  typeof tableFeaturesConfig,
  AdWidget
>[] => [
  {
    id: "select",

    enableSorting: false,
    enableHiding: false,

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(checked === true);

          const pageRows = table.getRowModel().rows;

          setSelectedIds((prev) => {
            if (checked === true) {
              const newIds = pageRows
                .filter((row) => row.getCanSelect())
                .map((row) => row.original.id);

              return Array.from(new Set([...prev, ...newIds]));
            }

            const pageIds = new Set(pageRows.map((row) => row.original.id));

            return prev.filter((id) => !pageIds.has(id));
          });
        }}
        aria-label="Select all"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => {
          row.toggleSelected(checked === true);

          setSelectedIds((prev) => {
            if (checked === true) {
              return [...prev, row.original.id];
            }

            return prev.filter((id) => id !== row.original.id);
          });
        }}
        aria-label="Select row"
      />
    ),
  },

  {
    accessorKey: "name",

    header: ({ column }) => (
      <AdWidgetSortableColumn column={column} title="Name" />
    ),

    cell: ({ row }) => (
      <div className="max-w-100 truncate font-medium">{row.original.name}</div>
    ),
  },

  {
    accessorKey: "position",

    header: ({ column }) => (
      <AdWidgetSortableColumn column={column} title="Position" />
    ),

    cell: ({ row }) => (
      <span className="capitalize">{row.original.position}</span>
    ),
  },

  {
    accessorKey: "order",

    header: ({ column }) => (
      <AdWidgetSortableColumn column={column} title="Order" />
    ),

    cell: ({ row }) => <span>{row.original.order}</span>,
  },

  {
    accessorKey: "isActive",

    header: "Status",

    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <span className={isActive ? "text-green-600" : "text-muted-foreground"}>
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },

  {
    accessorKey: "mobileOnly",

    header: "Mobile Only",

    cell: ({ row }) => <span>{row.original.mobileOnly ? "Yes" : "No"}</span>,
  },

  {
    accessorKey: "showClose",

    header: "Close Button",

    cell: ({ row }) => <span>{row.original.showClose ? "Yes" : "No"}</span>,
  },

  {
    id: "actions",

    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => {
      const adWidget = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="flex size-8 items-center justify-center rounded-md hover:bg-muted"
          >
            <MoreHorizontal className="size-4" />

            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setAdWidget(adWidget);
                onView(true);
              }}
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setAdWidget(adWidget);
                onEdit(true);
                setType("edit");
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setSelectedIds([]);
                setRowSelection({});
                setTypeDelete("single");
                setAdWidget(adWidget);
                onDelete(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
