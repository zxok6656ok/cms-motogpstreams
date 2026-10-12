import { getArticles } from "../../../lib/article";
import { ArticleCard } from "./components/article-card";
import { ArticlePagination } from "./components/article-pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircleIcon, List, Search } from "lucide-react";

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
  const [{ articles, currentPage, totalPages, total }] = await Promise.all([
    getArticles(page, search),
  ]);

  return (
    <div className="w-full bg-white">
      <main className="mx-auto px-2  py-2">
        <section className="mb-10 px-2 py-1 sm:py-2 sm:mb-24">
          <div className="min-w-0  max-w-full rounded-lg border bg-white px-3 py-2 text-sm text-muted-foreground">
            <div className="mb-0 flex items-center gap-2 uppercase text-sm text-muted-foreground">
              <List className="size-4" />
              <span>video terbaru</span>
            </div>
          </div>
          <div className="mx-auto w-full">
            <section className="mx-0 py-3">
              <div className="mx-auto w-full">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  {search && (
                    <div className="flex flex-wrap items-center gap-1">
                      <div className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-muted-foreground">
                        <Search className="size-4 shrink-0" />

                        <span className="shrink-0">SEARCH RESULTS:</span>

                        <span className="min-w-0 max-w-32 truncate font-medium text-foreground sm:max-w-56">
                          {search}
                        </span>

                        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {total}
                        </span>
                      </div>

                      <Link href="/">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1.5 rounded-lg border-border bg-white px-3 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          Reset
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
            {articles.length > 0 ? (
              <>
                <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
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
              <div className="flex h-32 min-w-0 max-w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-center">
                <AlertCircleIcon className="size-6 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">
                  VIDEO NOT FOUND
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
