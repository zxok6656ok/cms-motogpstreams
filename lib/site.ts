import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getSiteSetting = unstable_cache(
  async () => {
    return prisma.siteSetting.findFirstOrThrow({
      include: {
        hero: true,
        footerItems: true,
        navbarItems: true,
        socialLinks: true,
        adLinks: true,
      },
    });
  },
  ["site-setting"],
  {
    tags: ["site-setting"],
  },
);

export const getSiteSeo = unstable_cache(
  async () => {
    return prisma.siteSetting.findFirstOrThrow({
      select: {
        title: true,
        siteName: true,
        siteUrl: true,
        ogImage: true,
        metaTitle: true,
        metaDescription: true,
        logo: true,
      },
    });
  },
  ["site-seo"],
  {
    tags: ["site-setting"],
  },
);
