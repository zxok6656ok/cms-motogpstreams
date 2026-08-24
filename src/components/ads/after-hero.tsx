"use client";

import { useEffect, useMemo, useRef } from "react";
import { AdsSectionProps } from "../../../lib/ads";

interface Props {
  ads: AdsSectionProps[];
  position: "head" | "body";
}

const AdsSection = ({ ads, position }: Props) => {
  

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredAds = useMemo(() => {
    return ads
      .filter(
        (ad) =>
          ad.isActive &&
          ad.position === position
      )
      .sort((a, b) => a.order - b.order);
  }, [ads, position]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scripts = container.querySelectorAll("script");

    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");

      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      newScript.textContent = oldScript.textContent;

      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [filteredAds]);

  if (filteredAds.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-2 w-full max-w-6xl px-4 sm:mt-4">
      <div
        ref={containerRef}
        className="flex w-full flex-col items-center justify-center gap-2"
      >
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className={`relative w-full ${
              ad.mobileOnly ? "block md:hidden" : ""
            }`}
            style={{
              minHeight: `${ad.height}px`,
              maxWidth:
                ad.maxWidth === "sm"
                  ? "640px"
                  : ad.maxWidth === "md"
                    ? "768px"
                    : ad.maxWidth === "lg"
                      ? "1024px"
                      : ad.maxWidth === "xl"
                        ? "1280px"
                        : "100%",
            }}
          >
            {ad.htmlCode && (
              <div
                className="w-full"
                dangerouslySetInnerHTML={{
                  __html: ad.htmlCode,
                }}
              />
            )}

            {ad.scriptCode && (
              <div
                dangerouslySetInnerHTML={{
                  __html: ad.scriptCode,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdsSection;