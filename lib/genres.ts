import { unstable_cache } from "next/cache";
import prisma from "./prisma";

const PAGE_SIZE = 6;

async function fetchGenres(slug: string, page: number) {
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
            genres: {
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
        genres: {
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

export const getGenres = (slug: string, page = 1) =>
  unstable_cache(
    async () => {
      return fetchGenres(slug, page);
    },
    ["genres", slug, String(page)],
    {
      tags: ["genres", `genres:${slug}`],
      revalidate: 7200,
    },
  )();

export const getAllGenres = unstable_cache(
  async () => {
    return prisma.category.findMany({
      select: {
        name: true,
        slug: true,
      },
    });
  },
  ["genres"],
  {
    tags: ["genres"],
    revalidate: 7200,
  },
);
