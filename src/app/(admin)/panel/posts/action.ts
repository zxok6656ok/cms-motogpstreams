"use server";

import { Stream } from "@/generated/prisma/client";
import prisma from "../../../../../lib/prisma";
import { updateTag } from "next/cache";

export const deleteArticle = async (postId: string) => {
  try {
    const article = await prisma.article.findUniqueOrThrow({
      where: {
        id: postId,
      },
    });
    await prisma.article.delete({
      where: {
        id: postId,
      },
    });
    updateTag("articles");
    updateTag(`article:${article.slug}`);
    return {
      success: true,
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
    const metaDescription = data.get("metaDescription") as string;
    const categories = data.get("categories") as string;
    const content = data.get("content") as string;
    const streams = JSON.parse((data.get("streams") as string) || "[]");
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

          categories: {
            set: categoryRecords.map((category) => ({
              id: category.id,
            })),
          },

          streams: {
            deleteMany: {},
            create: streams.map((stream: Stream) => ({
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
      updateTag(`article:${slug}`);
    } else {
      article = await prisma.article.create({
        data: {
          title,
          slug,
          thumbnail,
          poster,
          metaDescription,
          content,
          categories: {
            connect: categoryRecords.map((category) => ({
              id: category.id,
            })),
          },

          streams: {
            create: streams.map((stream: Stream) => ({
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
  
    return {
      success: false,
      message: "Failed to save article.",
    };
  }
};
