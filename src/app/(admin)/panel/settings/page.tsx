
import SiteSettingForm from "./components/form";
import { Prisma } from "@/generated/prisma/client";
import prisma from "../../../../../lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export type SiteSetting = Prisma.SiteSettingGetPayload<{
  include: {
    footerItems: true;
    navbarItems: true;
    socialLinks: true;
    adLinks: true
  };
}>;
const page = async () => {
  const site = await prisma.siteSetting.findFirst({
    include: {
      footerItems: true,
      navbarItems: true,
      socialLinks: true,
      adLinks: true
    },
  });
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

          <p className="text-sm text-muted-foreground">
            Manage your blog settings.
          </p>
        </div>
      </div>
      <SiteSettingForm site={site} />
    </div>
  );
};

export default page;
