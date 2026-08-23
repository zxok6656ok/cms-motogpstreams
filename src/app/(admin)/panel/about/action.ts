"use server";

import { updateTag } from "next/cache";
import prisma from "../../../../../lib/prisma";

export async function updatePage(formData: FormData) {
  const id = formData.get("id")?.toString();
  const slug = formData.get("slug")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();

  if (!id || !slug || !title || !content) {
    throw new Error("Data tidak lengkap");
  }

  await prisma.page.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });

  updateTag(`page:${slug}`);
}