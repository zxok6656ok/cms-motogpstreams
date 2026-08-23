import type { MetadataRoute } from "next";
import { format } from "date-fns";

import prisma from "../../lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await prisma.siteSetting.findFirst({
    select: {
      siteUrl: true,
    },
  });

  const baseUrl = site?.siteUrl?.replace(/\/$/, "");

  if (!baseUrl) {
    return [];
  }

  const [articles, categories, pages] = await Promise.all([
    prisma.article.findMany({
      select: {
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.page.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...articles.map((article) => ({
      url: `${baseUrl}/${format(article.createdAt, "yyyy/MM/dd")}/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),

    ...pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}