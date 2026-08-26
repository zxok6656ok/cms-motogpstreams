"use client";

import { MoreHorizontal } from "lucide-react";

import type {
  Column,
  ColumnDef,
  RowSelectionState,
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
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

import type { Prisma } from "@/generated/prisma/client";

import Image from "next/image";

export type Article = Prisma.ArticleGetPayload<{
  include: {
    categories: true;
    streams: true;
  };
}>;

type PostColumn = Column<typeof tableFeaturesConfig, Article, unknown>;

function PostSortableColumn({
  column,
  title,
}: {
  column: PostColumn;
  title: string;
}) {
  const handleSort = column.getToggleSortingHandler();

  return (
    <SortableColumn
      title={title}
      sorted={column.getIsSorted()}
      onSort={handleSort}
    />
  );
}

type PostsTableAction = {
  setType: (props: "edit" | "add") => void;
  onEdit: (props: boolean) => void;
  onView: (props: boolean) => void;
  onDelete: (props: boolean) => void;
  setArticle: (props: Article) => void;
  setTypeDelete: (type: "single" | "many") => void;
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
};

export const getColumns = ({
  onEdit,
  onView,
  onDelete,
  setArticle,
  setType,
  setSelectedIds,
  setTypeDelete,
  setRowSelection,
}: PostsTableAction): ColumnDef<typeof tableFeaturesConfig, Article>[] => [
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
    accessorKey: "thumbnail",
    header: "Thumbnail",

    cell: ({ row }) => {
      const thumbnail = row.getValue("thumbnail") as string;

      return (
        <div className="relative h-14 w-20 overflow-hidden rounded-md">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Thumbnail"
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "poster",
    header: "WM Player",

    cell: ({ row }) => {
      const thumbnail = row.getValue("poster") as string;

      return (
        <div className="relative h-14 w-20 overflow-hidden rounded-md">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Thumbnail"
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "title",

    header: ({ column }) => (
      <PostSortableColumn column={column} title="Title" />
    ),

    cell: ({ row }) => (
      <div className="max-w-100 truncate font-medium">
        {row.getValue("title")}
      </div>
    ),
  },

  {
    accessorKey: "categories",

    header: ({ column }) => (
      <PostSortableColumn column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categori = row.original.categories.map((e) => e.name).join(", ");
      return <span>{categori}</span>;
    },
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => {
      const status = row.getValue("status") as Article["status"];

      return (
        <span
          className={
            status === "publish"
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
    id: "actions",

    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => {
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
            <DropdownMenuItem
              onClick={async () => {
                const url = `${window.location.origin}/${format(
                  row.original.createdAt,
                  "yyyy/MM/dd",
                )}/${row.original.slug}`;

                await navigator.clipboard.writeText(url);
              }}
            >
              Copy Slug
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setArticle(row.original);
                onView(true);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setArticle(row.original);
                onEdit(true);
                setType("edit");
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedIds([]);
                setRowSelection({});
                setTypeDelete("single");
                setArticle(row.original);
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
