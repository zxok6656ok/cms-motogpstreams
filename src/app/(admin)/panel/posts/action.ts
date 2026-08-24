"use server";

import { StatusArticle } from "@/generated/prisma/client";
import prisma from "../../../../../lib/prisma";
import { updateTag } from "next/cache";
type StreamInput = {
  name: string;
  type: "hls" | "dash";
  url: string;
  drmId?: string;
  drmKey?: string;
};
export const deleteArticle = async (postId: string) => {
  try {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: postId,
      },
    });
    if (!article) throw new Error("Failed to get article");
    await prisma.article.delete({
      where: {
        id: postId,
      },
    });
    updateTag("articles");
    updateTag(`article:${article.slug}`);
    return {
      success: true,
      message: "Success to delete article",
    };
  } catch (error) {
    throw new Error("Failed to delete article");
  }
};

export const saveArticle = async (data: FormData, id?: string | null) => {
  try {
    const title = data.get("title") as string;
    const thumbnail = data.get("thumbnail") as string;
    const poster = data.get("poster") as string;
    const slug = data.get("slug") as string;
    const status = data.get("status") as StatusArticle;
    const metaDescription = data.get("metaDescription") as string;
    const categories = data.get("categories") as string;
    const content = data.get("content") as string;
    const streams = JSON.parse(
      (data.get("streams") as string) || "[]",
    ) as StreamInput[];
    const categoryNames = categories
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);
    const categoryRecords = await Promise.all(
      categoryNames.map((name) => {
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        return prisma.category.upsert({
          where: {
            slug,
          },
          update: {
            name,
          },
          create: {
            name,
            slug,
          },
        });
      }),
    );

    let article;

    if (id) {
      const existingArticle = await prisma.article.findUnique({
        where: {
          id,
        },
        select: {
          slug: true,
        },
      });
      article = await prisma.article.update({
        where: {
          id,
        },
        data: {
          title,
          slug,
          thumbnail,
          poster,
          metaDescription,
          content,
          status,
          categories: {
            set: categoryRecords.map((category) => ({
              id: category.id,
            })),
          },

          streams: {
            deleteMany: {},
            create: streams.map((stream: StreamInput) => ({
              name: stream.name,
              type: stream.type,
              url: stream.url,
              drmId: stream.drmId,
              drmKey: stream.drmKey,
            })),
          },
        },
      });

      updateTag("articles");
      if (existingArticle?.slug) {
        updateTag(`article:${existingArticle.slug}`);
      }
      updateTag(`article:${article.slug}`);
    } else {
      article = await prisma.article.create({
        data: {
          title,
          slug,
          thumbnail,
          poster,
          metaDescription,
          status,
          content,
          categories: {
            connect: categoryRecords.map((category) => ({
              id: category.id,
            })),
          },

          streams: {
            create: streams.map((stream: StreamInput) => ({
              name: stream.name,
              type: stream.type,
              url: stream.url,
            })),
          },
        },
      });
      updateTag("articles");
    }

    return {
      success: true,
      data: article,
      message: id
        ? "The post was successfully updated."
        : "The post was successfully created.",
    };
  } catch (error) {
    throw new Error("Failed to save article");
  }
};

export const deleteAllArticle = async (ids: string[]) => {
  try {
    if (ids.length === 0) {
      throw new Error("No articles selected");
    }
    const articles = await prisma.article.findMany({
      where: {
        id: { in: ids },
      },
    });
    if (articles.length == 0) throw new Error("Failed to get articles");
    await prisma.article.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    updateTag("articles");

    articles.forEach((article) => {
      updateTag(`article:${article.slug}`);
    });
    return {
      success: true,
      message: `Success to delete ${articles.length} article`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete articles",
    };
  }
};
