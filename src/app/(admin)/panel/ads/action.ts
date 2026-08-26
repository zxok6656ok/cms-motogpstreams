"use server";

import { AdWidgetPosition } from "@/generated/prisma/enums";
import prisma from "../../../../../lib/prisma";
import { updateTag } from "next/cache";

export const adWidgetSave = async (formData: FormData, id?: string | null) => {
  try {
    const name = formData.get("name") as string;
    const htmlCode = formData.get("htmlCode") as string;
    const scriptCode = formData.get("scriptCode") as string;

    const position = formData.get("position") as AdWidgetPosition;
    const order = Number(formData.get("order"));
    const height = Number(formData.get("height"));

    const maxWidth = formData.get("maxWidth") as string;

    const isActive = formData.get("isActive") === "true";
    const mobileOnly = formData.get("mobileOnly") === "true";
    const showClose = formData.get("showClose") === "true";

    const ads = id
      ? await prisma.adWidget.update({
          where: { id },
          data: {
            name,
            htmlCode: htmlCode || null,
            scriptCode: scriptCode || null,
            position,
            order,
            isActive,
            height,
            maxWidth,
            mobileOnly,
            showClose,
          },
        })
      : await prisma.adWidget.create({
          data: {
            name,
            htmlCode: htmlCode || null,
            scriptCode: scriptCode || null,
            position,
            order,
            isActive,
            height,
            maxWidth,
            mobileOnly,
            showClose,
          },
        });
    updateTag("ads-widget");
    return {
      success: true,
      data: ads,
      message: id
        ? "The ads widgets was successfully updated."
        : "The ads widgets was successfully created.",
    };
  } catch (error) {
    throw new Error("Failed to save ads widgets.");
  }
};

export const deleteAllAdWidget = async (ids: string[]) => {
  try {
    if (ids.length === 0) {
      throw new Error("No ads widgets selected");
    }
    const ads = await prisma.adWidget.findMany({
      where: {
        id: { in: ids },
      },
    });
    if (ads.length == 0) throw new Error("Failed to get ads widgets");
    await prisma.adWidget.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    updateTag("ads-widget");
    return {
      success: true,
      message: `Success to delete ${ads.length} ads widgets`,
    };
  } catch (error) {
    throw new Error("Failed to delete ads widgets");
  }
};

export const deleteAdWidget = async (id: string) => {
  try {
    const ads = await prisma.adWidget.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    if (!ads) throw new Error("Failed to get ads widgets");
    await prisma.adWidget.delete({
      where: {
        id: id,
      },
    });
    updateTag("ads-widget");
    return {
      success: true,
      message: "Success to delete ads widgets",
    };
  } catch (error) {
    throw new Error("Failed to delete ads widgets");
  }
};
