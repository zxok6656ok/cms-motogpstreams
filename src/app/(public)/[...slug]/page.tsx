import { getSiteSeo, getSiteSetting } from "../../../../lib/site";
import { notFound } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

import Player from "../components/player";

import { getArticle } from "../../../../lib/article";
import { Metadata } from "next";

export type Posts = Prisma.ArticleGetPayload<{
  include: {
    streams: {
      select: {
        name: true;
        type: true;
        url: true;
        drmId: true;
        drmKey: true;
        directLink: true;
        directLinkActive: true;
      };
    };
    categories: {
      select: {
        name: true;
        slug: true;
      };
    };
  };
}>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const articleSlug = slug.at(-1);

  if (!articleSlug) {
    return {};
  }

  const [post, site] = await Promise.all([
    getArticle(articleSlug),
    getSiteSeo(),
  ]);

  if (!post) {
    return {};
  }

  const [year, month, day] = slug;

  const canonical = `${site.siteUrl}/${year}/${month}/${day}/${post.slug}`;

  const description = post.metaDescription || post.title;

  return {
    title: post.title,

    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: canonical,
      siteName: site.siteName,

      publishedTime: post.createdAt
        ? new Date(post.createdAt).toISOString()
        : undefined,

      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : undefined,

      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : site.ogImage
          ? [
              {
                url: site.ogImage,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.thumbnail
        ? [post.thumbnail]
        : site.ogImage
          ? [site.ogImage]
          : undefined,
    },
  };
}

type PageProps = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const articleSlug = slug.at(-1);

  if (!articleSlug) {
    notFound();
  }

  const [posts, site] = await Promise.all([
    getArticle(articleSlug),
    getSiteSetting(),
  ]);

  if (!posts) {
    notFound();
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",

    headline: posts.title,

    description: posts.metaDescription || posts.title,

    image: posts.thumbnail
      ? [posts.thumbnail]
      : site.ogImage
        ? [site.ogImage]
        : undefined,

    datePublished: posts.createdAt
      ? new Date(posts.createdAt).toISOString()
      : undefined,

    dateModified: posts.updatedAt
      ? new Date(posts.updatedAt).toISOString()
      : posts.createdAt
        ? new Date(posts.createdAt).toISOString()
        : undefined,

    author: {
      "@type": "Organization",
      name: site.siteName,
      url: site.siteUrl,
    },

    publisher: {
      "@type": "Organization",
      name: site.siteName,
      url: site.siteUrl,
      ...(site.logo
        ? {
            logo: {
              "@type": "ImageObject",
              url: site.logo,
            },
          }
        : {}),
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.siteUrl}/${posts.slug}`,
    },
  };
  const playerSite = {
    playerNoticeTitle: site.playerNoticeTitle,
    playerNoticeDescription: site.playerNoticeDescription,
    telegramTitle: site.telegramTitle,
    telegramDescription: site.telegramDescription,
    socialLinks: site.socialLinks,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Player posts={posts} site={playerSite} />
    </>
  );
};

export default Page;
