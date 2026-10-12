import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  search?: string;
};

export function ArticlePagination({
  currentPage,
  totalPages,
  search = "",
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const createUrl = (page: number) => {
    const params = new URLSearchParams();

    if (search) {
      params.set("q", search);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const query = params.toString();

    return query ? `/?${query}` : "/";
  };


return (
  <nav
    aria-label="Pagination"
    className="mt-10 flex flex-wrap items-center justify-center gap-2"
  >
    {currentPage > 1 ? (
      <Link
        href={createUrl(currentPage - 1)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
      >
        <span aria-hidden="true">←</span>
        Previous
      </Link>
    ) : (
      <span
        aria-disabled="true"
        className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg border bg-muted/50 px-4 text-sm font-medium text-muted-foreground opacity-60"
      >
        <span aria-hidden="true">←</span>
        Previous
      </span>
    )}

    <span
      aria-current="page"
      className="inline-flex h-10 items-center rounded-lg border bg-muted/50 px-4 text-sm font-medium tabular-nums"
    >
      {currentPage} / {totalPages}
    </span>

    {currentPage < totalPages ? (
      <Link
        href={createUrl(currentPage + 1)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
      >
        Next
        <span aria-hidden="true">→</span>
      </Link>
    ) : (
      <span
        aria-disabled="true"
        className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg border bg-muted/50 px-4 text-sm font-medium text-muted-foreground opacity-60"
      >
        Next
        <span aria-hidden="true">→</span>
      </span>
    )}
  </nav>
);

}