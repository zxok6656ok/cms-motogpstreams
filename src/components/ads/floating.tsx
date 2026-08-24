"use client";

import Script from "next/script";
import { useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import clsx from "clsx";

interface AdsFloatingProps {
  ad: {
    id: string;
    htmlCode: string | null;
    scriptCode: string | null;
    height: number;
    maxWidth: string;
    mobileOnly: boolean;
    showClose: boolean;
  };
}

export default function AdsFloating({ ad }: AdsFloatingProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  if (process.env.NODE_ENV !== "production") return null;
  if (!isOpen) return null;

  const widthClass =
    {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-full",
    }[ad.maxWidth] ?? "max-w-md";

  return (
    <>
      {ad.scriptCode && (
        <Script id={`ad-script-${ad.id}`} strategy="afterInteractive">
          {ad.scriptCode}
        </Script>
      )}

      <div
        className={clsx(
          "fixed bottom-0 left-0 right-0 z-9999 flex justify-center pointer-events-none transition-all duration-300",
          ad.mobileOnly && "md:hidden",
          isClosing
            ? "translate-y-full opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        <Card
          style={{
            height: `${ad.height}px`,
          }}
          className={clsx(
            "relative w-full mx-2 mb-2 bg-white/90 backdrop-blur shadow-xl border pointer-events-auto",
            widthClass,
          )}
        >
          {ad.showClose && (
            <button
              type="button"
              aria-label="Close Ad"
              onClick={handleClose}
              className="absolute top-1 right-1 z-10 p-1 rounded-md hover:bg-gray-100 transition"
            >
              <X size={16} />
            </button>
          )}

          <div
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{
              __html: ad.htmlCode ?? "",
            }}
          />
        </Card>
      </div>
    </>
  );
}
