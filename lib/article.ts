import { unstable_cache } from "next/cache";
import prisma from "./prisma";

const PAGE_SIZE = 15;

async function fetchArticles(page: number, search: string) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = {
    status: "publish" as const,

    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              metaDescription: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              categories: {
                some: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  return Promise.all([
    prisma.article.findMany({
      where,

      omit: {
        updatedAt: true,
        content: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: PAGE_SIZE,
    }),

    prisma.article.count({
      where,
    }),
  ]);
}

export const getArticles = (page = 1, search = "") =>
  unstable_cache(
    async () => {
      const [articles, total] = await fetchArticles(page, search);

      return {
        articles,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
        currentPage: page,
        search,
      };
    },
    ["articles", String(page), search],
    {
      tags: ["articles"],
      revalidate: 7200,
    },
  )();

export const getArticle = (slug: string) =>
  unstable_cache(
    async () => {
      return prisma.article.findUnique({
        where: {
          slug,
          status: "publish",
        },
        include: {
          iframe: {
            select: {
              title: true,
              src: true,
              isActive: true,
            },
          },
          download: {
            select: {
              quality: true,
              links: {
                select: { name: true, url: true },
              },
            },
          },
          categories: {
            select: {
              name: true,
              slug: true,
            },
          },
          genres: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });
    },
    ["article", slug],
    {
      tags: ["article", `article:${slug}`],
      revalidate: 7200,
    },
  )();
