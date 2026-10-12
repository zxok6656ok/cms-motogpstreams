import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getAllCategory } from "../../../../lib/category";
import { getSiteSeo } from "../../../../lib/site";
import { List } from "lucide-react";
import Loading from "./loading";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSeo();

  const title = `Category - ${site.siteName}`;

  const description =
    `Browse all categories on ${site.siteName}. ` +
    `Find articles and content by category.`;

  const canonical = `${site.siteUrl}/category`;

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

export default async function CategoryPage() {
  const categories = await getAllCategory();

  if (categories.length === 0) {
    notFound();
  }

  return (
    <div className="w-full bg-white">
      <main className="mx-auto px-2  py-2">
        <section className="mb-10 px-2 py-1 sm:py-2 sm:mb-24">
          <div className="mx-auto w-full">
            <div className="min-w-0  max-w-full rounded-lg border bg-white px-3 py-2 text-sm text-muted-foreground">
              <div className="mb-0 flex items-center gap-2 uppercase text-sm text-muted-foreground">
                <List className="size-4" />
                <span>Category</span>
              </div>
            </div>
            {categories.length > 0 ? (
              <div className="mt-4 mb-4 flex min-h-8 flex-wrap gap-2">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`}>
                    <span className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border bg-black px-3 py-2 text-sm text-white">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className="
              border-4 border-black
              bg-white
              p-10
              text-center
              font-black
              shadow-[7px_7px_0_#000]
            "
              >
                There are no category yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
