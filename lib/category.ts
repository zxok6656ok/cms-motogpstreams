import { unstable_cache } from "next/cache";
import prisma from "./prisma";

const PAGE_SIZE = 6;

async function fetchCategory(slug: string, page: number) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [category, total] = await Promise.all([
    prisma.category.findUnique({
      where: {
        slug,
      },
      select: {
        name: true,
        slug: true,
        articles: {
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: PAGE_SIZE,
          include: {
            categories: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),

    prisma.article.count({
      where: {
        categories: {
          some: {
            slug,
          },
        },
      },
    }),
  ]);

  return {
    category,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage,
  };
}

export const getCategory = (slug: string, page = 1) =>
  unstable_cache(
    async () => {
      return fetchCategory(slug, page);
    },
    ["category", slug, String(page)],
    {
      revalidate: 3600,
      tags: ["categories", `category:${slug}`],
    },
  )();