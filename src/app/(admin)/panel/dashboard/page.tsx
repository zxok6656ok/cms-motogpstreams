import { Metadata } from "next";
import prisma from "../../../../../lib/prisma";
import { DashboardCards } from "./components/card";
import Message from "./components/message";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Admin",
  },
};

export default async function DashboardPage() {
  const [articles, categories, streams, siteSetting] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.stream.count(),
    prisma.siteSetting.findFirst({
      select: {
        siteName: true,
        logo: true,
      },
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Message />
      </div>
      <DashboardCards
        articles={articles}
        categories={categories}
        streams={streams}
        siteConfigured={!!siteSetting}
      />
    </div>
  );
}
