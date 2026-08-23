import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from "@tanstack/react-table";

export const tableFeaturesConfig = tableFeatures({
  columnVisibilityFeature,

  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),

  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),

  rowSelectionFeature,

  sortFns,
});