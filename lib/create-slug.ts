"use server";

import prisma from "./prisma";

import crypto from "crypto";

const createSlug = async (
  model: "article" | "category",
  value: string,
  limit = 100,
  excludeId?: string,
) => {
  const baseSlug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const exists = async (slug: string) => {
    const where = {
      slug,
      ...(excludeId
        ? {
            id: {
              not: excludeId,
            },
          }
        : {}),
    };

    if (model === "article") {
      return prisma.article.findFirst({
        where,
        select: { id: true },
      });
    }

    return prisma.category.findFirst({
      where,
      select: { id: true },
    });
  };

  const cleanSlug =
    baseSlug.length > limit
      ? baseSlug.slice(0, limit).replace(/-+$/, "")
      : baseSlug;

  if (!(await exists(cleanSlug))) {
    return cleanSlug;
  }

  while (true) {
    const random = crypto.randomBytes(3).toString("hex");
    const suffix = `-${random}`;

    const maxBaseLength = limit - suffix.length;

    const truncatedBase =
      cleanSlug.length > maxBaseLength
        ? cleanSlug.slice(0, maxBaseLength).replace(/-+$/, "")
        : cleanSlug;

    const newSlug = `${truncatedBase}${suffix}`;

    if (!(await exists(newSlug))) {
      return newSlug;
    }
  }
};

export default createSlug;
