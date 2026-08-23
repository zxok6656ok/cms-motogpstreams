import {
  PrismaClient,
  Prisma,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const siteName = "LIVEMOTOGP";

const articleData: Prisma.ArticleCreateInput[] = [
  {
    title: "Live Streaming MotoGP",
    slug: "live-streaming-motogp",
    content: "",
    streams: {
      create: [
        {
          name: "Server 1",
          type: "hls",
          url: "https://s1.strea.ru/index.m3u8",
        },
        {
          name: "Server 2",
          type: "hls",
          url: "https://s2.strea.ru/index.m3u8",
        },
      ],
    },
    categories: {
      create: [
        {
          name: "Live MotoGP",
          slug: "live-motogp",
        },
        {
          name: "Live WSBK",
          slug: "live-wsbk",
        },
      ],
    },
  },
];

const pageData: Prisma.PageCreateInput[] = [
  {
    slug: "about",
    title: "About",
    content: `
      <h2>Tentang LIVEMOTOGP</h2>
      <p>
        LIVEMOTOGP adalah situs nonton live streaming MotoGP.
      </p>
    `,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    content: `
      <h2>Privacy Policy</h2>

      <p>
        Privasi pengunjung merupakan hal yang penting bagi LIVEMOTOGP.
        Kebijakan Privasi ini menjelaskan bagaimana informasi dapat
        dikumpulkan, digunakan, dan dilindungi ketika Anda mengakses
        situs LIVEMOTOGP.
      </p>

      <h3>Informasi yang Dikumpulkan</h3>

      <p>
        LIVEMOTOGP dapat mengumpulkan informasi tertentu secara otomatis,
        seperti alamat IP, jenis perangkat, browser, halaman yang dikunjungi,
        serta informasi teknis lainnya yang diperlukan untuk meningkatkan
        keamanan dan pengalaman pengguna.
      </p>

      <h3>Penggunaan Informasi</h3>

      <p>
        Informasi yang dikumpulkan dapat digunakan untuk mengoperasikan,
        memelihara, dan meningkatkan layanan, menganalisis penggunaan situs,
        serta menjaga keamanan situs dari aktivitas yang tidak sah.
      </p>

      <h3>Cookies</h3>

      <p>
        LIVEMOTOGP dapat menggunakan cookies atau teknologi serupa untuk
        menyimpan preferensi pengguna, memahami penggunaan situs, dan
        meningkatkan pengalaman pengunjung.
      </p>

      <h3>Layanan Pihak Ketiga</h3>

      <p>
        Situs ini dapat menggunakan layanan pihak ketiga seperti layanan
        analitik, iklan, atau layanan eksternal lainnya. Pihak ketiga
        tersebut dapat memiliki kebijakan privasi mereka sendiri.
      </p>

      <h3>Keamanan</h3>

      <p>
        Kami berusaha menerapkan langkah-langkah yang wajar untuk melindungi
        informasi yang tersedia pada situs. Namun, tidak ada metode
        transmisi atau penyimpanan data melalui internet yang dapat
        dijamin sepenuhnya aman.
      </p>

      <h3>Perubahan Kebijakan Privasi</h3>

      <p>
        LIVEMOTOGP dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
        Setiap perubahan akan diterapkan pada halaman ini.
      </p>

      <h3>Hubungi Kami</h3>

      <p>
        Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini,
        silakan menghubungi LIVEMOTOGP melalui kontak yang tersedia di situs.
      </p>
    `,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    content: `
      <h2>Disclaimer</h2>

      <p>
        Informasi yang tersedia di LIVEMOTOGP disediakan untuk tujuan
        informasi dan hiburan.
      </p>

      <p>
        Kami berusaha menjaga informasi yang tersedia tetap akurat,
        namun tidak menjamin seluruh informasi selalu lengkap atau bebas
        dari kesalahan.
      </p>
    `,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    content: `
      <h2>Terms & Conditions</h2>

      <p>
        Dengan mengakses dan menggunakan LIVEMOTOGP, Anda menyetujui
        ketentuan yang berlaku di situs ini.
      </p>

      <p>
        Pengguna bertanggung jawab atas penggunaan informasi dan layanan
        yang tersedia di situs.
      </p>
    `,
  },
];

const siteSettingData: Prisma.SiteSettingCreateInput = {
  siteName,
  title: `${siteName} - Live Streaming MotoGP`,
  description: `${siteName} adalah situs nonton live streaming MotoGP.`,
  siteUrl: "https://LIVEMOTOGP.com",
  logo: "",
  favicon: "",
  ogImage: "",
  metaTitle: `${siteName} - Anime, Manga & Novel`,
  metaDescription: `${siteName} adalah situs nonton live streaming MotoGP.`,

  socialLinks: {
    create: [
      {
        name: `${siteName} Telegram`,
        platform: "telegram",
        url: "https://t.me/LIVEMOTOGP",
      },
      {
        name: `${siteName} Facebook`,
        platform: "facebook",
        url: "https://facebook.com/LIVEMOTOGP",
      },
      {
        name: `${siteName} Instagram`,
        platform: "instagram",
        url: "https://instagram.com/LIVEMOTOGP",
      },
      {
        name: `${siteName} YouTube`,
        platform: "youtube",
        url: "https://youtube.com/@LIVEMOTOGP",
      },
      {
        name: `${siteName} TikTok`,
        platform: "tiktok",
        url: "https://tiktok.com/@LIVEMOTOGP",
      },
    ],
  },

  navbarItems: {
    create: [
      {
        name: "Home",
        url: "/",
        order: 0,
      },
      {
        name: "Anime",
        url: "/anime",
        order: 1,
      },
      {
        name: "Manga",
        url: "/manga",
        order: 2,
      },
      {
        name: "Novel",
        url: "/novel",
        order: 3,
      },
    ],
  },

  footerItems: {
    create: [
      {
        name: "About",
        url: "/about",
        order: 0,
      },
      {
        name: "Privacy Policy",
        url: "/privacy",
        order: 1,
      },
      {
        name: "Disclaimer",
        url: "/disclaimer",
        order: 2,
      },
      {
        name: "Contact",
        url: "/contact",
        order: 3,
      },
    ],
  },

  adLinks: {
    create: [
      {
        name: "Advertisement",
        url: "https://example.com",
        order: 0,
        
      },
    ],
  },
};

export async function main() {
  try {
    await prisma.siteSetting.create({
      data: siteSettingData,
    });

    for (const article of articleData) {
      await prisma.article.create({
        data: article,
      });
    }

    for (const page of pageData) {
      await prisma.page.create({
        data: page,
      });
    }

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();