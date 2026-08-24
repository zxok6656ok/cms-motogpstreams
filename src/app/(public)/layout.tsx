import type { Metadata } from "next";
import Script from "next/script";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Prisma } from "@/generated/prisma/client";
import { getSiteSetting } from "../../../lib/site";
import Hero from "@/components/hero";
import { getAds } from "../../../lib/ads";
import AdsSection from "@/components/ads/after-hero";

export type Site = Prisma.SiteSettingGetPayload<{
  include: {
    hero: true;
    footerItems: true;
    navbarItems: true;
    socialLinks: true;
    adLinks: true;
  };
}>;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSetting();

  const title = site.metaTitle || site.siteName;
  const description = site.metaDescription || site.description || undefined;

  return {
    metadataBase: site.siteUrl ? new URL(site.siteUrl) : undefined,

    title: {
      default: title,
      template: `%s | ${site.siteName}`,
    },

    description,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    icons: {
      icon: site.favicon || undefined,
    },

    alternates: {
      canonical: "/",
    },

    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: site.siteName,
      title,
      description,
      url: site.siteUrl || undefined,
      images: site.ogImage
        ? [
            {
              url: site.ogImage,
              width: 1200,
              height: 630,
              alt: site.siteName,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: site.ogImage ? [site.ogImage] : undefined,
    },
  };
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [site, ads] = await Promise.all([getSiteSetting(), getAds()]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-G3KNCQ8N7G"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-G3KNCQ8N7G');
      `}
      </Script>

      {/* Google Site Verification */}
      <meta
        name="google-site-verification"
        content="xVjUOmyMEh47V9G9RsUsjdBI1_TsLi8zG1qkIXS--kU"
      />

      {process.env.VERCEL_ENV === "production" &&
        site.adLinks
          .filter((ad) => ad.position === "head" && ad.isActive)
          .map((ad) => (
            <Script key={ad.id} src={ad.url} strategy="lazyOnload" />
          ))}

      <div className="m-0 w-full p-0">
        <Navbar site={site} />
       
        {process.env.VERCEL_ENV === "production" && (
          <AdsSection ads={ads} position="head" />
        )}
        {children}
        {process.env.VERCEL_ENV === "production" && (
          <AdsSection ads={ads} position="body" />
        )}
        <Footer site={site} />
      </div>

      {process.env.VERCEL_ENV === "production" &&
        site.adLinks
          .filter((ad) => ad.position === "body" && ad.isActive)
          .map((ad) => (
            <Script key={ad.id} src={ad.url} strategy="lazyOnload" />
          ))}
    </>
  );
}
