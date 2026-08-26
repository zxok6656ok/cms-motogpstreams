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
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="mt-2 flex items-center gap-1 text-2xl font-black tracking-tighter md:text-4xl">
                  <List className="size-[1em]" />
                  News
                </h1>
              </div>

              {search && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-1 font-bold shadow-[3px_3px_0px_0px_#000]">
                    <Search className="size-4 shrink-0" />

                    <span>Search results:</span>

                    <span className="max-w-50 truncate  px-2 py-0">
                      {search}
                    </span>

                    <span className="text-sm text-slate-600">({total})</span>
                  </div>

                  <Link href={"/"}>
                    <Button
                      variant="outline"
                      className="
                        rounded-none
                        border-2 border-black
                        bg-[#dfff00]
                        font-bold
                        py-2
                        
                        text-black
                        shadow-[3px_3px_0px_0px_#000]
                        transition-all
                        hover:translate-x-0.5
                        hover:translate-y-0.5
                        hover:bg-[#4d7aff]
                        hover:text-black
                        hover:shadow-none
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
              <div className="mb-8 border-4 border-black bg-[#ffde59] p-4 font-black shadow-[5px_5px_0_#000]">
                SEARCH RESULTS: &quot;{search}&quot;
                <span className="ml-2">({total})</span>
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
