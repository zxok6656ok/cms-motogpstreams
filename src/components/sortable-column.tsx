"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface SortableColumnProps {
  title: string;
  sorted: false | "asc" | "desc";
  onSort?: (event: unknown) => void;
}

export function SortableColumn({
  title,
  sorted,
  onSort,
}: SortableColumnProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="px-0 hover:bg-transparent"
      onClick={(event) => {
        onSort?.(event);
      }}
    >
      {title}

      {sorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}