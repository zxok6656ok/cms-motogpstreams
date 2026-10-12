"use server";

import { Prisma, StatusArticle } from "@/generated/prisma/client";

import prisma from "../../../../../lib/prisma";

import { revalidatePath, updateTag } from "next/cache";

type ImportArticleInput = {
  title: string;
  url?: string;
  img?: string;
  image?: string;
  date?: string;
  categories: string;
  genres: string;
  iframe?: {
    server: string;
    src: string;
  }[];
  downloads?: {
    quality: string;
    links: {
      name: string;
      url: string;
    }[];
  }[];
};

type StreamInput = {
  id?: string;

  title: string;

  src: string;

  isActive?: boolean;
};

type DownloadInput = {
  id?: string;

  quality: string;

  isActive: boolean;

  links: {
    id?: string;

    name: string;

    url: string;

    isActive: boolean;
  }[];
};

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    iframe: true;

    categories: true;

    genres: true;

    download: {
      include: { links: true };
    };
  };
}>;

const revalidateArticlePaths = () => {
  revalidatePath("/panel");

  revalidatePath("/panel/posts");

  revalidatePath("/[...slug]", "page");

  revalidatePath("/category");

  revalidatePath("/category/[...slug]", "page");
};

export const deleteArticle = async (postId: string) => {
  try {
    const article = await prisma.article.findUniqueOrThrow({
      where: { id: postId },

      include: {
        categories: {
          select: { slug: true },
        },

        genres: {
          select: { slug: true },
        },
      },
    });

    await prisma.article.delete({
      where: { id: postId },
    });

    updateTag("articles");

    updateTag(`article:${article.slug}`);

    updateTag("categories");

    updateTag("genres");

    for (const category of article.categories) {
      updateTag(`category:${category.slug}`);
    }

    for (const genre of article.genres) {
      updateTag(`genre:${genre.slug}`);
    }

    revalidateArticlePaths();

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
    const title = (data.get("title") as string) ?? "";

    const uploadBy = (data.get("uploadBy") as string) || "ZZZ";

    const thumbnail = (data.get("thumbnail") as string) || "";

    const slug = (data.get("slug") as string) ?? "";

    const status = data.get("status") as StatusArticle;

    const metaDescription = (data.get("metaDescription") as string) || "";

    const categories = (data.get("categories") as string) || "";

    const genres = (data.get("genres") as string) || "";

    const content = (data.get("content") as string) ?? "";

    const streams = JSON.parse(
      (data.get("iframe") as string) || "[]",
    ) as StreamInput[];

    const downloads = JSON.parse(
      (data.get("download") as string) || "[]",
    ) as DownloadInput[];

    const categoryNames = [
      ...new Set(
        categories

          .split(",")

          .map((category) => category.trim())

          .filter(Boolean),
      ),
    ];

    const genresNames = [
      ...new Set(
        genres

          .split(",")

          .map((genre) => genre.trim())

          .filter(Boolean),
      ),
    ];

    const categoryRecords = await Promise.all(
      categoryNames.map((name) => {
        const categorySlug = name

          .toLowerCase()

          .trim()

          .replace(/[^a-z0-9]+/g, "-")

          .replace(/^-+|-+$/g, "");

        return prisma.category.upsert({
          where: { slug: categorySlug },

          update: { name },

          create: {
            name,

            slug: categorySlug,
          },
        });
      }),
    );

    const genresRecords = await Promise.all(
      genresNames.map((name) => {
        const genreSlug = name

          .toLowerCase()

          .trim()

          .replace(/[^a-z0-9]+/g, "-")

          .replace(/^-+|-+$/g, "");

        return prisma.genre.upsert({
          where: { slug: genreSlug },

          update: { name },

          create: {
            name,

            slug: genreSlug,
          },
        });
      }),
    );

    const article = await prisma.$transaction(async (tx) => {
      let articleId = id;

      let existingArticle: {
        id: string;

        slug: string;

        categories: { slug: string }[];

        genres: { slug: string }[];
      } | null = null;

      if (articleId) {
        existingArticle = await tx.article.findUnique({
          where: { id: articleId },

          select: {
            id: true,

            slug: true,

            categories: {
              select: { slug: true },
            },

            genres: {
              select: { slug: true },
            },
          },
        });

        if (!existingArticle) {
          throw new Error("Article not found");
        }

        await tx.article.update({
          where: { id: articleId },

          data: {
            title,

            slug,

            thumbnail,

            uploadBy,

            metaDescription,

            content,

            status,

            categories: {
              set: categoryRecords.map((category) => ({
                id: category.id,
              })),
            },

            genres: {
              set: genresRecords.map((genre) => ({
                id: genre.id,
              })),
            },
          },
        });
      } else {
        const createdArticle = await tx.article.create({
          data: {
            title,

            slug,

            thumbnail,

            uploadBy,

            metaDescription,

            content,

            status,

            categories: {
              connect: categoryRecords.map((category) => ({
                id: category.id,
              })),
            },

            genres: {
              connect: genresRecords.map((genre) => ({
                id: genre.id,
              })),
            },
          },
        });

        articleId = createdArticle.id;
      }

      if (!articleId) {
        throw new Error("Failed to resolve article ID");
      }

      const existingDownloads = await tx.download.findMany({
        where: { articleId },
        select: {
          id: true,
          links: { select: { id: true } },
        },
      });

      const existingDownloadIds = new Set(
        existingDownloads.map((download) => download.id),
      );

      const submittedDownloadIds = downloads
        .map((download) => download.id)
        .filter((downloadId): downloadId is string => Boolean(downloadId));

      for (const downloadId of submittedDownloadIds) {
        if (!existingDownloadIds.has(downloadId)) {
          throw new Error("Download does not belong to this article");
        }
      }

      const submittedDownloadIdSet = new Set(submittedDownloadIds);
      const downloadIdsToDelete = existingDownloads
        .map((download) => download.id)
        .filter((downloadId) => !submittedDownloadIdSet.has(downloadId));

      if (downloadIdsToDelete.length > 0) {
        await tx.download.deleteMany({
          where: {
            articleId,
            id: { in: downloadIdsToDelete },
          },
        });
      }

      for (const download of downloads) {
        if (download.id) {
          const existingDownloadRecord = existingDownloads.find(
            (item) => item.id === download.id,
          );

          if (!existingDownloadRecord) {
            throw new Error("Download does not belong to this article");
          }

          const existingLinkIds = new Set(
            existingDownloadRecord.links.map((link) => link.id),
          );

          const submittedLinkIds = download.links
            .map((link) => link.id)
            .filter((linkId): linkId is string => Boolean(linkId));

          for (const linkId of submittedLinkIds) {
            if (!existingLinkIds.has(linkId)) {
              throw new Error("Download link does not belong to this download");
            }
          }

          const submittedLinkIdSet = new Set(submittedLinkIds);
          const linkIdsToDelete = existingDownloadRecord.links
            .map((link) => link.id)
            .filter((linkId) => !submittedLinkIdSet.has(linkId));

          if (linkIdsToDelete.length > 0) {
            await tx.downloadLink.deleteMany({
              where: {
                downloadId: download.id,
                id: { in: linkIdsToDelete },
              },
            });
          }

          await tx.download.update({
            where: {
              id: download.id,
              articleId,
            },
            data: {
              quality: download.quality,
              isActive: download.isActive,
            },
          });

          for (const link of download.links) {
            if (link.id) {
              await tx.downloadLink.update({
                where: {
                  id: link.id,
                  downloadId: download.id,
                },
                data: {
                  name: link.name,
                  url: link.url,
                  isActive: link.isActive,
                },
              });
            } else {
              await tx.downloadLink.create({
                data: {
                  name: link.name,
                  url: link.url,
                  isActive: link.isActive,
                  downloadId: download.id,
                },
              });
            }
          }
        } else {
          await tx.download.create({
            data: {
              quality: download.quality,
              isActive: download.isActive,
              articleId,
              links: {
                create: download.links.map((link) => ({
                  name: link.name,
                  url: link.url,
                  isActive: link.isActive,
                })),
              },
            },
          });
        }
      }

      const existingStreams = await tx.iframe.findMany({
        where: { articleId },

        select: { id: true },
      });

      const existingIds = new Set(existingStreams.map((stream) => stream.id));

      const submittedIds = streams

        .map((stream) => stream.id)

        .filter((streamId): streamId is string => Boolean(streamId));

      for (const streamId of submittedIds) {
        if (!existingIds.has(streamId)) {
          throw new Error("Iframe does not belong to this article");
        }
      }

      const submittedIdSet = new Set(submittedIds);

      const idsToDelete = existingStreams

        .map((stream) => stream.id)

        .filter((streamId) => !submittedIdSet.has(streamId));

      if (idsToDelete.length > 0) {
        await tx.iframe.deleteMany({
          where: {
            articleId,

            id: { in: idsToDelete },
          },
        });
      }

      for (const stream of streams) {
        if (stream.id) {
          await tx.iframe.update({
            where: {
              id: stream.id,

              articleId,
            },

            data: {
              title: stream.title,

              src: stream.src,

              isActive: stream.isActive ?? true,
            },
          });
        } else {
          await tx.iframe.create({
            data: {
              title: stream.title,

              src: stream.src,

              isActive: stream.isActive ?? true,

              articleId,
            },
          });
        }
      }

      return tx.article.findUniqueOrThrow({
        where: { id: articleId },

        include: {
          iframe: true,

          categories: true,

          genres: true,

          download: {
            include: { links: true },
          },
        },
      });
    });

    updateTag("articles");

    updateTag(`article:${article.slug}`);

    updateTag("categories");

    for (const category of article.categories) {
      updateTag(`category:${category.slug}`);
    }

    if (id) {
      const previous = await prisma.article.findUnique({
        where: { id },

        select: { slug: true },
      });

      void previous;
    }

    revalidateArticlePaths();

    return {
      success: true,

      data: article as ArticleWithRelations,

      message: id
        ? "The post was successfully updated."
        : "The post was successfully created.",
    };
  } catch (error) {
 
    throw new Error(
      error instanceof Error
        ? `Failed to save article: ${error.message}`
        : "Failed to save article",
    );
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

      include: {
        categories: {
          select: { slug: true },
        },

        genres: {
          select: { slug: true },
        },
      },
    });

    if (articles.length === 0) {
      throw new Error("Failed to get articles");
    }

    await prisma.article.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    updateTag("articles");

    updateTag("categories");

    updateTag("genres");

    const affectedCategorySlugs = new Set<string>();

    const affectedGenreSlugs = new Set<string>();

    for (const article of articles) {
      updateTag(`article:${article.slug}`);

      for (const category of article.categories) {
        affectedCategorySlugs.add(category.slug);
      }

      for (const genre of article.genres) {
        affectedGenreSlugs.add(genre.slug);
      }
    }

    for (const categorySlug of affectedCategorySlugs) {
      updateTag(`category:${categorySlug}`);
    }

    for (const genreSlug of affectedGenreSlugs) {
      updateTag(`genre:${genreSlug}`);
    }

    revalidateArticlePaths();

    return {
      success: true,

      message: `Success to delete ${articles.length} article`,
    };
  } catch (error) {

    throw new Error("Failed to delete articles");
  }
};

// json

export const importArticles = async (items: ImportArticleInput[]) => {
  const results: {
    title: string;
    success: boolean;
    message: string;
  }[] = [];

  for (const [index, item] of items.entries()) {
    try {
      if (!item.title?.trim()) {
        throw new Error("Title wajib diisi");
      }

      const slugBase = item.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const formData = new FormData();

      formData.set("title", item.title.trim());
      formData.set("slug", `${slugBase}-${crypto.randomUUID().slice(0, 8)}`);
      formData.set("uploadBy", "ZZZ");
      formData.set("thumbnail", item.img || item.image || "");
      formData.set("status", "publish");
      formData.set("metaDescription", "");
      formData.set("categories", item.categories || "");
      formData.set("genres", item.genres || "");
      formData.set("content", "");

      formData.set(
        "iframe",
        JSON.stringify(
          (item.iframe ?? []).map((stream) => ({
            title: stream.server,
            src: stream.src,
            isActive: true,
          })),
        ),
      );

      formData.set(
        "download",
        JSON.stringify(
          (item.downloads ?? []).map((download) => ({
            quality: download.quality.trim(),
            isActive: true,
            links: download.links.map((link) => ({
              name: link.name,
              url: link.url,
              isActive: true,
            })),
          })),
        ),
      );

      const result = await saveArticle(formData, null);

      if (result.success) {
        updateTag("articles");
        updateTag(`article:${result.data.slug}`);
        updateTag("categories");

        for (const category of result.data.categories) {
          updateTag(`category:${category.slug}`);
        }
      }

      results.push({
        title: item.title,
        success: true,
        message: result.message,
      });
    } catch (error) {
      results.push({
        title: item.title || `Artikel ${index + 1}`,
        success: false,
        message: error instanceof Error ? error.message : "Import gagal",
      });
    }
  }

  return {
    total: items.length,
    success: results.filter((item) => item.success).length,
    failed: results.filter((item) => !item.success).length,
    results,
  };
};
