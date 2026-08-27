import { getArticles } from "../../../lib/article";
import { ArticleCard } from "./components/article-card";
import { ArticlePagination } from "./components/article-pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { List, Search } from "lucide-react";
import Hero from "@/components/hero";
import { getSiteSetting } from "../../../lib/site";

type HomePageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const search = (params.q ?? "").trim();
  const isSearching = search.length > 0;
  const [site, { articles, currentPage, totalPages, total }] =
    await Promise.all([getSiteSetting(), getArticles(page, search)]);
  return (
    <div className="w-full ">
      {!isSearching && <Hero site={site} />}
      <main className="mx-auto max-w-6xl px-2  py-2">
        <section className="border-b-4 border-black mx-2 py-2">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-1 sm:gap-3 md:gap-6  md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="mt-2 flex items-center gap-1 text-xl  sm:text-2xl font-black tracking-tighter ">
                  <List className="size-[1em]" />
                  News
                </h1>
              </div>

              {search && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div
                    className="
        flex
        min-w-0
        max-w-full
        items-center
        gap-1.5
        border-2
        border-black
        bg-white
        px-2
        py-1
        text-sm
        font-bold
        shadow-[3px_3px_0px_0px_#000]
        sm:gap-2
        sm:px-3
        sm:py-1.5
        sm:text-base
      "
                  >
                    <Search className="size-3.5 shrink-0 sm:size-4" />

                    <span className="shrink-0 ">Search results:</span>

                    <span
                      className="
          min-w-0
          max-w-30
          truncate
          px-1
          sm:max-w-50
          sm:px-2
        "
                    >
                      {search}
                    </span>

                    <span className="shrink-0 text-xs text-slate-600 sm:text-sm">
                      ({total})
                    </span>
                  </div>

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="
          h-8
          rounded-none
          border-2
          border-black
          bg-[#dfff00]
          px-3
          text-xs
          font-bold
          text-black
          shadow-[3px_3px_0px_0px_#000]
          transition-all
          hover:translate-x-0.5
          hover:translate-y-0.5
          hover:bg-[#4d7aff]
          hover:text-black
          hover:shadow-none
          sm:h-9
          sm:px-4
          sm:text-sm
        "
                    >
                      Reset
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-10 px-2 py-5 sm:py-10 sm:mb-24">
          <div className="mx-auto max-w-7xl">
            {search && (
              <div
                className="
      mb-5
      border-2
      border-black
      bg-[#ffde59]
      p-2.5
      text-sm
      font-black
      leading-tight
      shadow-[3px_3px_0_#000]
      sm:mb-8
      sm:border-4
      sm:p-4
      sm:text-base
      sm:leading-normal
      sm:shadow-[5px_5px_0_#000]
    "
              >
                SEARCH RESULTS: &quot;{search}&quot;
                <span className="ml-1 sm:ml-2">({total})</span>
              </div>
            )}

            {articles.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                <ArticlePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  search={search}
                />
              </>
            ) : (
              <div className="border-4 border-black bg-white p-12 text-center font-black shadow-[7px_7px_0_#000]">
                ARTICLE NOT FOUND
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
