import { unstable_cache } from "next/cache";
import prisma from "./prisma";
import { Prisma } from "@/generated/prisma/client";

export const getAds = unstable_cache(
  async () => {
    return prisma.adWidget.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  },
  ["ads-widget"],
  {
    tags: ["ads-widget"],
  },
);

export type AdsSectionProps = Prisma.AdWidgetGetPayload<{
  omit: {
    createdAt: true;
    updatedAt: true;
    showClose: true;
  };
}>;
