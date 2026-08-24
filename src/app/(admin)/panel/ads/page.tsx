import { Prisma } from "@/generated/prisma/client";
import { Metadata } from "next";

import Table from "./components/table";
import prisma from "../../../../../lib/prisma";

export const metadata: Metadata = {
  title: "Ads Widgets",
};

export type AdWidget = Prisma.AdWidgetGetPayload<{
  select: {
    id: true;
    name: true;
    htmlCode: true;
    scriptCode: true;
    position: true;
    order: true;
    isActive: true;
    height: true;
    maxWidth: true;
    mobileOnly: true;
    showClose: true;
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

  const where: Prisma.AdWidgetWhereInput = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const [ads, total] = await Promise.all([
    prisma.adWidget.findMany({
      where,
      orderBy: [
        {
          position: "asc",
        },
        {
          order: "asc",
        },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        htmlCode: true,
        scriptCode: true,
        position: true,
        order: true,
        isActive: true,
        height: true,
        maxWidth: true,
        mobileOnly: true,
        showClose: true,
      },
    }),

    prisma.adWidget.count({
      where,
    }),
  ]);

  const pageCount = Math.ceil(total / pageSize);

  return (
    <Table
      data={ads}
      page={page}
      pageSize={pageSize}
      pageCount={pageCount}
      total={total}
      search={search}
    />
  );
};

export default Page;
