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
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-3">
      {currentPage > 1 ? (
        <Link
          href={createUrl(currentPage - 1)}
          className="
            border-4 border-black
            bg-white
            px-5 py-3
            font-black
            shadow-[5px_5px_0_#000]
            transition-all
            hover:translate-x-0.5
            hover:translate-y-0.5
            hover:shadow-[3px_3px_0_#000]
          "
        >
          ← PREV
        </Link>
      ) : (
        <span className="border-4 border-black bg-neutral-300 px-5 py-3 font-black opacity-50">
          ← PREV
        </span>
      )}

      <div className="border-4 border-black bg-[#ffde59] px-5 py-3 font-black shadow-[5px_5px_0_#000]">
        {currentPage} / {totalPages}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createUrl(currentPage + 1)}
          className="
            border-4 border-black
            bg-black
            px-5 py-3
            font-black
            text-white
            shadow-[5px_5px_0_#000]
            transition-all
            hover:translate-x-0.5
            hover:translate-y-0.5
            hover:shadow-[3px_3px_0_#000]
          "
        >
          NEXT →
        </Link>
      ) : (
        <span className="border-4 border-black bg-neutral-300 px-5 py-3 font-black opacity-50">
          NEXT →
        </span>
      )}
    </nav>
  );
}