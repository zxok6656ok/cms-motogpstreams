"use server";

import prisma from "../../../../../lib/prisma";
import { updateTag } from "next/cache";

export const saveSiteSettings = async (
  data: FormData,
  id: string | undefined,
) => {
  try {
    const siteName = data.get("siteName") as string;
    const title = data.get("title") as string;
    const googleAnalyticsId = data.get("googleAnalyticsId") as string;
    const googleSiteVerification = data.get("googleSiteVerification") as string;
    const description = data.get("description") as string;
    const siteUrl = data.get("siteUrl") as string;

    const logo = data.get("logo") as string;
    const favicon = data.get("favicon") as string;
    const ogImage = data.get("ogImage") as string;

    const metaTitle = data.get("metaTitle") as string;
    const metaDescription = data.get("metaDescription") as string;

    const socialLinks = JSON.parse((data.get("socialLinks") as string) || "[]");

    const navbarItems = JSON.parse((data.get("navbarItems") as string) || "[]");

    const footerItems = JSON.parse((data.get("footerItems") as string) || "[]");
    const AdLinks = JSON.parse((data.get("adLinks") as string) || "[]");
    const playerNoticeTitle = data.get("playerNoticeTitle") as string;
    const playerNoticeDescription = data.get(
      "playerNoticeDescription",
    ) as string;

    const telegramTitle = data.get("telegramTitle") as string;
    const telegramDescription = data.get("telegramDescription") as string;
    await prisma.siteSetting.update({
      where: {
        id,
      },
      data: {
        siteName,
        title,
        description,
        siteUrl,
        logo,
        favicon,
        ogImage,
        metaTitle,
        metaDescription,
        playerNoticeTitle,
        playerNoticeDescription,
        googleSiteVerification,
        googleAnalyticsId,
        telegramTitle,
        telegramDescription,
        socialLinks: {
          deleteMany: {},
          create: socialLinks.map(
            (item: {
              name: string;
              platform:
                | "telegram"
                | "facebook"
                | "instagram"
                | "twitter"
                | "youtube"
                | "tiktok"
                | "pinterest";
              url: string;
            }) => ({
              name: item.name,
              platform: item.platform,
              url: item.url,
            }),
          ),
        },
        navbarItems: {
          deleteMany: {},
          create: navbarItems.map(
            (item: { name: string; url: string; order: number }) => ({
              name: item.name,
              url: item.url,
              order: item.order,
            }),
          ),
        },
        footerItems: {
          deleteMany: {},
          create: footerItems.map(
            (item: { name: string; url: string; order: number }) => ({
              name: item.name,
              url: item.url,
              order: item.order,
            }),
          ),
        },
        adLinks: {
          deleteMany: {},
          create: AdLinks.map(
            (item: {
              name: string;
              url: string;
              order: number;
              position: "head" | "body";
              isActive: boolean;
            }) => ({
              name: item.name,
              url: item.url,
              order: item.order,
              position: item.position,
              isActive: item.isActive,
            }),
          ),
        },
      },
    });
    updateTag("site-setting");
    return {
      success: true,
      data: "site-settings",
      message: "Site settings were successfully saved.",
    };
  } catch (error) {
    throw new Error("Failed to save site settings.");
  }
};
