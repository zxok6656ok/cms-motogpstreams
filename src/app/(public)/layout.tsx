import type { Metadata } from "next";
import Script from "next/script";
import { Prisma } from "@/generated/prisma/client";
import { getSiteSetting } from "../../../lib/site";
import { getAds } from "../../../lib/ads";
import AdsSection from "@/components/ads/after-hero";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-public";
import { Separator } from "@/components/ui/separator";
import Breadcrumbnav from "@/components/breadcrumb-nav";
import SearchField from "./components/search";

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
    <SidebarProvider>
      <AppSidebar site={site} />

      <SidebarInset>
   
        <header className="sticky top-0 z-50 flex h-16 min-w-0 shrink-0 items-center gap-2 overflow-hidden border-b bg-white px-3 sm:px-4">
          <SidebarTrigger className="-ml-1 shrink-0" />

          <Separator
            orientation="vertical"
            className="shrink-0 data-vertical:h-4 data-vertical:self-auto"
          />

          <div className="min-w-0 flex-1 overflow-hidden">
            <Breadcrumbnav />
          </div>

          <div className="w-[140px] shrink-0 sm:w-auto">
            <SearchField />
          </div>
        </header>
     
        <div className="w-full min-w-0 max-w-full">
          {/* Google Analytics */}
          {process.env.VERCEL_ENV === "production" &&
            site.googleAnalyticsId && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}`}
                  strategy="afterInteractive"
                />

                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${site.googleAnalyticsId}');
                `}
                </Script>
              </>
            )}

          {/* Google Site Verification */}
          {process.env.VERCEL_ENV === "production" &&
            site.googleSiteVerification && (
              <meta
                name="google-site-verification"
                content={site.googleSiteVerification}
              />
            )}

          {/* Head Ad Scripts */}
          {process.env.VERCEL_ENV === "production" &&
            site.adLinks
              .filter((ad) => ad.position === "head" && ad.isActive)
              .map((ad) => (
                <Script key={ad.id} src={ad.url} strategy="lazyOnload" />
              ))}

          {process.env.VERCEL_ENV === "production" && (
            <AdsSection ads={ads} position="head" />
          )}

          {children}

          {process.env.VERCEL_ENV === "production" && (
            <AdsSection ads={ads} position="body" />
          )}
          {/* Body Ad Scripts */}
          {process.env.VERCEL_ENV === "production" &&
            site.adLinks
              .filter((ad) => ad.position === "body" && ad.isActive)
              .map((ad) => (
                <Script key={ad.id} src={ad.url} strategy="lazyOnload" />
              ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
