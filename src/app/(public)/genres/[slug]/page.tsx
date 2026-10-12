import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategory } from "../../../../../lib/category";
import { ArticleCard } from "../../components/article-card";
import { Metadata } from "next";
import { getSiteSeo } from "../../../../../lib/site";
import { ArrowLeft, ArrowRight, List } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const [result, site] = await Promise.all([
    getCategory(slug, 1),
    getSiteSeo(),
  ]);

  if (!result.category) {
    return {};
  }

  const categoryName = result.category.name;

  const title = `${categoryName} - ${site.siteName}`;

  const description = `Browse the latest articles in the ${categoryName} category on ${site.siteName}.`;

  const canonical = `${site.siteUrl}/category/${result.category.slug}`;

  return {
    title,

    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: site.siteName,

      images: site.ogImage
        ? [
            {
              url: site.ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      images: site.ogImage ? [site.ogImage] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const page = Math.max(1, Number(pageParam) || 1);

  const { category, total, totalPages, currentPage } = await getCategory(
    slug,
    page,
  );

  if (!category) {
    notFound();
  }

  return (
     <div className="w-full bg-white">
      <main className="mx-auto px-4  py-4">
        {/* Header */}
        <section className="mb-8 rounded-xl border bg-card p-5 sm:p-7">
          <div className="mb-4 flex items-center uppercase gap-2 text-sm text-muted-foreground">
            <List className="size-4" />
            <span>Genres</span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                {category.name}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                {total} {total === 1 ? "video" : "videos"} in this genres
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              All videos
            </Link>
          </div>
        </section>

        {/* Articles */}
        {category.articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {category.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                {currentPage > 1 && (
                  <Link
                    href={`/category/${category.slug}?page=${currentPage - 1}`}
                    aria-label="Previous page"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Previous</span>
                  </Link>
                )}

                <span className="inline-flex h-10 items-center rounded-lg border bg-muted/50 px-4 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                  <Link
                    href={`/category/${category.slug}?page=${currentPage + 1}`}
                    aria-label="Next page"
                    className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <span>Next</span>
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-xl border bg-card px-6 py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
              <List className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No videos yet</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are no videos in this genres yet.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Browse all videos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
