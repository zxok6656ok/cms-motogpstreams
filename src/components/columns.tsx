"use client";

import { MoreHorizontal } from "lucide-react";

import type { Column, ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SortableColumn } from "./sortable-column";

import { tableFeaturesConfig } from "../lib/table-features";

export type Post = {
  id: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  author: string;
  date: string;
};

function PostSortableColumn({
  column,
  title,
}: {
  column: Column<typeof tableFeaturesConfig, Post, unknown>;

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

export const columns: ColumnDef<typeof tableFeaturesConfig, Post>[] = [
  {
    accessorKey: "title",

    header: ({ column }) => (
      <PostSortableColumn column={column} title="Title" />
    ),

    cell: ({ row }) => (
      <div className="max-w-[400px] truncate font-medium">
        {row.getValue("title")}
      </div>
    ),
  },

  {
    accessorKey: "category",

    header: ({ column }) => (
      <PostSortableColumn column={column} title="Category" />
    ),
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => {
      const status = row.getValue("status") as Post["status"];

      return (
        <span
          className={
            status === "Published"
              ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          }
        >
          {status}
        </span>
      );
    },
  },

  {
    accessorKey: "author",

    header: ({ column }) => (
      <PostSortableColumn column={column} title="Author" />
    ),
  },

  {
    accessorKey: "date",

    header: ({ column }) => <PostSortableColumn column={column} title="Date" />,
  },

  {
    id: "actions",

    enableSorting: false,

    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="
              inline-flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              border
              border-transparent
              hover:bg-muted
            "
          >
            <MoreHorizontal className="h-4 w-4" />

            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Edit:", post.id)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => console.log("View:", post.id)}>
              View
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => console.log("Delete:", post.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
