"use client";

import { MoreHorizontal } from "lucide-react";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

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

import type { User } from "@supabase/supabase-js";

export type AuthUser = User;

type UsersTableAction = {
  onEdit: (value: boolean) => void;
  onView: (value: boolean) => void;
  onDelete: (value: boolean) => void;
  setUser: (user: AuthUser) => void;
};

type UserColumn = Column<typeof tableFeaturesConfig, AuthUser, unknown>;

function UserSortableColumn({
  column,
  title,
}: {
  column: UserColumn;
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
  setUser,
}: UsersTableAction): ColumnDef<typeof tableFeaturesConfig, AuthUser>[] => [
  {
    id: "select",

    enableSorting: false,
    enableHiding: false,

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => {
          table.toggleAllPageRowsSelected(checked === true);
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
        }}
        aria-label="Select row"
      />
    ),
  },

  {
    accessorKey: "email",

    header: ({ column }) => (
      <UserSortableColumn column={column} title="Email" />
    ),

    cell: ({ row }) => (
      <div className="max-w-100 truncate font-medium">
        {row.original.email ?? "-"}
      </div>
    ),
  },

  {
    id: "display_name",

    header: "Name",

    cell: ({ row }) => (
      <span>{row.original.user_metadata?.display_name ?? "-"}</span>
    ),
  },

  {
    id: "provider",

    header: "Provider",

    cell: ({ row }) => (
      <span>{row.original.app_metadata?.provider ?? "-"}</span>
    ),
  },

  {
    accessorKey: "created_at",

    header: ({ column }) => (
      <UserSortableColumn column={column} title="Created" />
    ),

    cell: ({ row }) =>
      formatDistanceToNow(new Date(row.original.created_at), {
        addSuffix: true,
        locale: id,
      }),
  },
  {
    accessorKey: "last_sign_in_at",

    header: ({ column }) => (
      <UserSortableColumn column={column} title="Last Sign In" />
    ),

    cell: ({ row }) => {
      const lastSignIn = row.original.last_sign_in_at;

      if (!lastSignIn) {
        return <span className="text-muted-foreground">Never</span>;
      }

      return formatDistanceToNow(new Date(lastSignIn), {
        addSuffix: true,
        locale: id,
      });
    },
  },
];
