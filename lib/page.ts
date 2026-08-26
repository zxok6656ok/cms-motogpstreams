import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export const getPage = async (slug: string) => {
  return unstable_cache(
    async () => {
      return prisma.page.findUnique({
        where: {
          slug,
        },
      });
    },
    ["page", slug],
    {
      tags: [`page:${slug}`],
    },
  )();
};
