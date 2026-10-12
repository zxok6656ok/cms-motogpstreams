
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const siteName = "Example Portal";

const siteSettingData: Prisma.SiteSettingCreateInput = {
  siteName,
  title: "Example Portal - Streaming & Downloads",
  description:
    "Portal demo untuk streaming, artikel, dan download dengan berbagai pilihan kualitas.",
  siteUrl: "https://example.com",
  logo: "https://placehold.co/300x100?text=Example+Portal",
  favicon: "https://placehold.co/64x64?text=EP",
  ogImage: "https://placehold.co/1200x630?text=Example+Portal",
  metaTitle: "Example Portal - Streaming & Downloads",
  metaDescription:
    "Portal demo untuk menampilkan artikel, streaming, dan link download.",
  playerNoticeTitle: "Player Bermasalah?",
  playerNoticeDescription:
    "Periksa koneksi internet atau coba gunakan browser lain.",
  telegramTitle: "Gabung Komunitas",
  telegramDescription: "Informasi dan pembaruan terbaru.",
  googleAnalyticsId: null,
  googleSiteVerification: null,

  socialLinks: {
    create: [
      {
        name: "Example Facebook",
        platform: "facebook",
        url: "https://example.com/facebook",
      },
      {
        name: "Example Telegram",
        platform: "telegram",
        url: "https://example.com/telegram",
      },
      {
        name: "Example YouTube",
        platform: "youtube",
        url: "https://example.com/youtube",
      },
      {
        name: "Example X",
        platform: "twitter",
        url: "https://example.com/x",
      },
    ],
  },

  navbarItems: {
    create: [
      { name: "Home", url: "/", order: 0 },
      { name: "Streaming", url: "/streaming", order: 1 },
      { name: "Downloads", url: "/downloads", order: 2 },
      { name: "Telegram", url: "https://example.com/community", order: 3 },
    ],
  },

  footerItems: {
    create: [
      { name: "About", url: "/about", order: 0 },
      { name: "Privacy Policy", url: "/privacy", order: 1 },
      { name: "Disclaimer", url: "/disclaimer", order: 2 },
      { name: "Terms & Conditions", url: "/terms", order: 3 },
    ],
  },

  adLinks: {
    create: [
      {
        name: "Demo Ad Header",
        url: "https://example.com/ad-header.js",
        order: 0,
        position: "head",
        isActive: false,
      },
      {
        name: "Demo Ad Body",
        url: "https://example.com/ad-body.js",
        order: 1,
        position: "body",
        isActive: false,
      },
    ],
  },

  hero: {
    create: {
      badge: "WELCOME",
      title: "EXAMPLE",
      subtitle: "PORTAL",
      year: "2026",
      description:
        "Portal demo untuk streaming, artikel, dan download.",
      primaryButtonText: "JELAJAHI SEKARANG",
      primaryButtonUrl: "/",
      secondaryButtonText: "Selengkapnya",
      secondaryButtonUrl: "/about",
    },
  },
};

const adWidgetData: Prisma.AdWidgetCreateInput[] = [
  {
    name: "DEMO HEADER",
    htmlCode: '<div class="demo-ad">Header Advertisement</div>',
    scriptCode: null,
    position: "head",
    order: 0,
    isActive: false,
    height: 90,
    maxWidth: "full",
    mobileOnly: false,
    showClose: false,
  },
  {
    name: "DEMO BODY",
    htmlCode: '<div class="demo-ad">Body Advertisement</div>',
    scriptCode: null,
    position: "body",
    order: 0,
    isActive: false,
    height: 90,
    maxWidth: "full",
    mobileOnly: false,
    showClose: false,
  },
];

const articleData = [
  {
    title: "Demo Live Streaming",
    slug: "demo-live-streaming",
    metaDescription: "Contoh artikel streaming dengan beberapa server.",
    content: `
      <h2>Demo Live Streaming</h2>
      <p>Ini adalah artikel contoh untuk pengujian CMS.</p>
    `,
    uploadBy: "Demo Admin",
    categories: [
      { name: "Streaming", slug: "streaming" },
      { name: "Entertainment", slug: "entertainment" },
    ],
    iframe: [
      {
        title: "Demo Server 1",
        src: "https://example.com/player-1",
        isActive: true,
      },
      {
        title: "Demo Server 2",
        src: "https://example.com/player-2",
        isActive: false,
      },
    ],
    download: [
      {
        quality: "[1080p]",
        isActive: true,
        order: 0,
        links: [
          {
            name: "Mirror 1",
            url: "https://example.com/download-1080-1",
            isActive: true,
            order: 0,
          },
          {
            name: "Mirror 2",
            url: "https://example.com/download-1080-2",
            isActive: true,
            order: 1,
          },
          {
            name: "Mirror 3",
            url: "https://example.com/download-1080-3",
            isActive: false,
            order: 2,
          },
        ],
      },
      {
        quality: "[720p]",
        isActive: true,
        order: 1,
        links: [
          {
            name: "Mirror 1",
            url: "https://example.com/download-720-1",
            isActive: true,
            order: 0,
          },
          {
            name: "Mirror 2",
            url: "https://example.com/download-720-2",
            isActive: true,
            order: 1,
          },
        ],
      },
      {
        quality: "[480p]",
        isActive: false,
        order: 2,
        links: [
          {
            name: "Mirror 1",
            url: "https://example.com/download-480-1",
            isActive: true,
            order: 0,
          },
        ],
      },
    ],
  },
  {
    title: "Demo Article Kedua",
    slug: "demo-article-kedua",
    metaDescription: "Artikel dummy kedua untuk pengujian.",
    content: `
      <h2>Demo Article Kedua</h2>
      <p>Konten contoh untuk menguji daftar artikel.</p>
    `,
    uploadBy: "Demo Admin",
    categories: [{ name: "Tutorial", slug: "tutorial" }],
    iframe: [],
    download: [],
  },
];

const pageData: Prisma.PageCreateInput[] = [
  {
    slug: "about",
    title: "About",
    content: `
      <h2>Tentang Example Portal</h2>
      <p>Ini adalah halaman informasi untuk situs demo.</p>
    `,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    content: `
      <h2>Privacy Policy</h2>
      <p>Halaman contoh kebijakan privasi.</p>
      <h3>Informasi yang Dikumpulkan</h3>
      <p>Jelaskan informasi yang dikumpulkan oleh situs.</p>
      <h3>Cookies</h3>
      <p>Jelaskan penggunaan cookies dan layanan pihak ketiga.</p>
    `,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    content: `
      <h2>Disclaimer</h2>
      <p>Halaman contoh disclaimer situs.</p>
    `,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    content: `
      <h2>Terms & Conditions</h2>
      <p>Halaman contoh syarat dan ketentuan penggunaan situs.</p>
    `,
  },
];

export async function main() {
  try {
    /*
     * Site Settings
     */
    await prisma.siteSetting.create({
      data: siteSettingData,
    });

    /*
     * Ad Widgets
     */
    for (const widget of adWidgetData) {
      await prisma.adWidget.create({
        data: widget,
      });
    }

    /*
     * Categories, Articles, Iframes & Downloads
     */
    for (const item of articleData) {
      await prisma.article.create({
        data: {
          title: item.title,
          slug: item.slug,
          metaDescription: item.metaDescription,
          content: item.content,
          uploadBy: item.uploadBy,

          categories: {
            connectOrCreate: item.categories.map((category) => ({
              where: { slug: category.slug },
              create: {
                name: category.name,
                slug: category.slug,
              },
            })),
          },

          iframe: {
            create: item.iframe,
          },

          download: {
            create: item.download.map((download) => ({
              quality: download.quality,
              isActive: download.isActive,
              order: download.order,

              links: {
                create: download.links,
              },
            })),
          },
        },
      });
    }

    /*
     * Static Pages
     */
    for (const page of pageData) {
      await prisma.page.create({
        data: page,
      });
    }

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  process.exitCode = 1;
});
