
import { Metadata } from "next";
import prisma from "../../../../../lib/prisma";
import Table from "./components/table";


export const metadata: Metadata = {
  title: "Posts",
}; 
import type { Prisma } from "@/generated/prisma/client";

export type Article = Prisma.ArticleGetPayload<{
  include: {
    categories: true;
    streams: true;
  };
}>;

type PageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);
  const pageSize = Math.max(Number(params.pageSize) || 10, 1);
  const search = params.search?.trim() || "";

  const where: Prisma.ArticleWhereInput = search
    ? {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categories: true,
        streams: true,
      },
    }),

    prisma.article.count({
      where,
    }),
  ]);

  const pageCount = Math.ceil(total / pageSize);

  return (
    <Table
      data={articles}
      page={page}
      pageSize={pageSize}
      pageCount={pageCount}
      total={total}
      search={search}
    />
  );
};

export default Page;