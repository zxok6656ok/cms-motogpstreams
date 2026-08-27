import Link from "next/link";
import { Site } from "@/app/(public)/layout";

import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiX,
  SiGithub,
  SiTiktok,
  SiTelegram,
  SiPinterest,
} from "react-icons/si";

const socialIcons = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
  github: SiGithub,
  tiktok: SiTiktok,
  telegram: SiTelegram,
  pinterest: SiPinterest,
  twitter: SiX,
};
export function Footer({ site }: { site: Site }) {
  if (!site) return;
  const privacyUrl =
    site.footerItems.find((item) => item.name === "Privacy Policy")?.url ?? "/";

  const termsUrl =
    site.footerItems.find((item) => item.name === "Terms & Conditions")?.url ??
    "/";

  return (
    <footer className="border-t-2 border-black bg-[#FFFDF5]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div
              className="
                inline-block
                border-2 border-black
                bg-[#4d7aff]
                px-2 sm:px-4 py-2
                text-base sm:text-2xl font-black
                text-black
                shadow-[4px_4px_0px_0px_#000]
              "
            >
              {site.title}
            </div>

            <p className="mt-5 max-w-md text-sm font-medium leading-6">
              {site.description}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-black">Navigation</h2>

            <div className="flex flex-col items-start gap-2">
              {site.footerItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  className="
                    font-bold
                    underline-offset-4
                    hover:text-[#4d7aff]
                    hover:underline
                  "
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-black">Connect</h2>

            <div className="flex gap-3">
              {site.socialLinks.map((item) => {
                const Icon =
                  socialIcons[item.platform as keyof typeof socialIcons];
                if (!Icon) return;
                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    aria-label={item.name}
                    className="
                      flex size-10 items-center justify-center
                      border-2 border-black
                      bg-white
                      shadow-[3px_3px_0px_0px_#000]
                      transition-all
                      hover:bg-[#4d7aff]
                      hover:translate-x-0.5
                      hover:translate-y-0.5
                      hover:shadow-none
                    "
                  >
                    <Icon className="size-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t-2 border-black pt-5">
          <div className="flex flex-col justify-between gap-2 text-sm font-bold md:flex-row">
            <p>
              © {new Date().getFullYear()} {site.title}. All rights reserved.
            </p>

            <div className="flex gap-4">
              <Link href={`${privacyUrl}`} className="hover:text-[#4d7aff]">
                Privacy
              </Link>

              <Link href={`${termsUrl}`} className="hover:text-[#4d7aff]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
