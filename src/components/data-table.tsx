"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  useTable,
  type ColumnDef,
  type RowData,
  type RowSelectionState,
  type OnChangeFn,
} from "@tanstack/react-table";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { tableFeaturesConfig } from "../lib/table-features";

interface DataTableProps<TData extends RowData> {
  data: TData[];

  columns: ColumnDef<typeof tableFeaturesConfig, TData>[];

  page: number;
  pageSize: number;
  pageCount: number;
  total: number;

  searchKey?: string;
  searchPlaceholder?: string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  page,
  pageSize,
  pageCount,
  total,
  searchKey = "",
  searchPlaceholder = "Search...",
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<TData>) {
  const slugTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchKey);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const table = useTable({
    features: tableFeaturesConfig,
    data,
    columns,

    manualPagination: true,
    pageCount,

    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
      rowSelection,
    },
    onRowSelectionChange,
  });

  const goToPage = (newPage: number) => {
    updateParams({
      page: String(newPage),
    });
  };

  useEffect(() => {
    return () => {
      if (slugTimeout.current) {
        clearTimeout(slugTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => {
            const value = event.target.value;

            setSearchValue(value);

            if (slugTimeout.current) {
              clearTimeout(slugTimeout.current);
            }

            slugTimeout.current = setTimeout(() => {
              updateParams({
                search: value,
                page: "1",
              });
            }, 500);
          }}
          className="pl-9 rounded-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-sm border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "item" : "items"}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="
    rounded-md
    border
    px-3
    py-1.5
    text-sm
    disabled:pointer-events-none
    disabled:opacity-50
  "
          >
            Previous
          </button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= pageCount}
            className="
    rounded-md
    border
    px-3
    py-1.5
    text-sm
    disabled:pointer-events-none
    disabled:opacity-50
  "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
