import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Breadcrumbnav from "@/components/breadcrumb-nav";
import { unstable_cache } from "next/cache";
import prisma from "../../../../lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export type Site = Prisma.SiteSettingGetPayload<{ select: { title: true } }>;
const getSiteSetting = unstable_cache(
  async () => {
    return prisma.siteSetting.findFirstOrThrow({
      select: { title: true, favicon: true },
    });
  },
  ["site-setting"],
  {
    tags: ["site-setting"],
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSetting();

  return {
    robots: {
      index: false,
      follow: false,
    },

    icons: {
      icon: site.favicon || undefined,
    },
  };
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSetting();

  if (!site) return;
  return (
    <SidebarProvider>
      <AppSidebar site={site} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumbnav />
        </header>
        <div className="w-full max-w-full overflow-x-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
