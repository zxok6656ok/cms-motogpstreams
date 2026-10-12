import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { Prisma } from "@/generated/prisma/client";

export const getAds = unstable_cache(
  async () => {
    return prisma.adLink.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  },
  ["ads-link"],
  {
    tags: ["ads-link"],
  },
);

export type AdsSectionProps = Prisma.AdLinkGetPayload<{
  omit: {
    createdAt: true;
    updatedAt: true;
    siteSettingId: true;
  };
}>;
