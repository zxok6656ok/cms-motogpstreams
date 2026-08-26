"use server";

import { updateTag } from "next/cache";
import prisma from "../../../../../lib/prisma";

export const updatePage = async (
  formData: FormData,
  page: string,
  id: string,
) => {
  try {
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    if (!id || !title || !content) {
      throw new Error("Not Found");
    }

    const update = await prisma.page.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });

    updateTag(`page:${update.slug}`);
    return {
      success: true,
      message: `Success to update  ${page}`,
    };
  } catch (error) {
    throw new Error(`Failed to update ${page}`);
  }
};
