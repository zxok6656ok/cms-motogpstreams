import { unstable_cache } from "next/cache";
import prisma from "./prisma";

const PAGE_SIZE = 6;

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

      include: {
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
      },

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
          streams: {
            select: {
              name: true,
              type: true,
              url: true,
              drmId: true,
              drmKey: true,
              directLink: true,
              directLinkActive: true,
            },
          },
          categories: {
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
    },
  )();
