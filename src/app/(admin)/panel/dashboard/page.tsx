import { Metadata } from "next";
import prisma from "../../../../../lib/prisma";
import { DashboardCards } from "./components/card";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Admin",
  },
};

export default async function DashboardPage() {
  const [articles, categories, streams, siteSetting] =
    await Promise.all([
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
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          <p className="text-sm text-muted-foreground">
           Overview of your website.
          </p>
        </div>
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