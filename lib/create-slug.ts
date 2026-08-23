"use server";

import prisma from "./prisma";

type SlugDelegate = {
  findFirst: (args: {
    where: {
      slug: string;
      id?: {
        not: string;
      };
    };
  }) => Promise<unknown>;
};

const createSlug = async (
  model: string,
  value: string,
  limit = 100,
  excludeId?: string,
) => {
  let slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length > limit) {
    const truncated = slug.slice(0, limit);
    const lastDash = truncated.lastIndexOf("-");

    slug = lastDash > 0 ? truncated.slice(0, lastDash) : truncated;
  }

  const exists = async (slug: string) => {
    if (model == "article") {
      return prisma.article.findFirst({
        where: {
          slug,
          ...(excludeId
            ? {
                id: {
                  not: excludeId,
                },
              }
            : {}),
        },
      });
    }
     return prisma.category.findFirst({
        where: {
          slug,
          ...(excludeId
            ? {
                id: {
                  not: excludeId,
                },
              }
            : {}),
        },
      });
  };

  if (!(await exists(slug))) {
    return slug;
  }

  let counter = 2;

  while (true) {
    const newSlug = `${slug}-${counter}`;

    if (!(await exists(newSlug))) {
      return newSlug;
    }

    counter++;
  }
};

export default createSlug;
