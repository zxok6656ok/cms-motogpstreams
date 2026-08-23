import type { MetadataRoute } from "next";

import prisma from "../../lib/prisma";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await prisma.siteSetting.findFirst({
    select: {
      siteUrl: true,
    },
  });

  const baseUrl = site?.siteUrl?.replace(/\/$/, "");

  if (!baseUrl) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}