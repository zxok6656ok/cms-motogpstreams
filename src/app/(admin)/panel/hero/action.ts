"use server";

import { updateTag } from "next/cache";
import prisma from "../../../../../lib/prisma";

export const heroSave = async (data: FormData) => {
  try {
    const site = await prisma.siteSetting.findFirst();

    if (!site) {
      return {
        success: false,
        message: "Site setting not found.",
      };
    }

    const badge = data.get("badge")?.toString() ?? "";
    const title = data.get("title")?.toString() ?? "";
    const subtitle = data.get("subtitle")?.toString() ?? "";
    const year = data.get("year")?.toString() ?? "";
    const description = data.get("description")?.toString() ?? "";

    const primaryButtonText = data.get("primaryButtonText")?.toString() ?? "";

    const primaryButtonUrl = data.get("primaryButtonUrl")?.toString() ?? "";

    const secondaryButtonText =
      data.get("secondaryButtonText")?.toString() ?? "";

    const secondaryButtonUrl = data.get("secondaryButtonUrl")?.toString() ?? "";

    if (!site.id) {
      return {
        success: false,
        message: "Site ID is required.",
      };
    }

    await prisma.heroSetting.upsert({
      where: {
        siteId: site.id,
      },

      create: {
        siteId: site.id,
        badge,
        title,
        subtitle,
        year,
        description,
        primaryButtonText,
        primaryButtonUrl,
        secondaryButtonText,
        secondaryButtonUrl,
      },

      update: {
        badge,
        title,
        subtitle,
        year,
        description,
        primaryButtonText,
        primaryButtonUrl,
        secondaryButtonText,
        secondaryButtonUrl,
      },
    });
    updateTag("site-setting")
    return {
      success: true,
      message: "The hero was successfully updated.",
    };
  } catch (error) {
  
    return {
      success: false,
      message: "Failed to save hero.",
    };
  }
};
