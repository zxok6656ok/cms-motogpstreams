import Link from "next/link";
import { AlertTriangle, Send } from "lucide-react";
import { PlayerSite } from "./player";

const PlayerNotice = ({ site }: { site: PlayerSite }) => {
  if (!site) return;
  const telegramUrl = site.socialLinks.find(
    (social) => social.platform === "telegram",
  )?.url;
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div
        className="
          border-2 border-black
          bg-[#FFD84D]
          p-4
          shadow-[5px_5px_0px_0px_#000]
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex size-10 shrink-0 items-center justify-center
              border-2 border-black
              bg-white
            "
          >
            <AlertTriangle className="size-5" />
          </div>

          <div>
            <h2 className="font-black text-sm sm:text-base">
              {site.playerNoticeTitle}
            </h2>

            <p className="mt-1 text-sm font-medium leading-5">
              {site.playerNoticeDescription}
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          border-2 border-black
          bg-[#4d7aff]
          p-4
          shadow-[5px_5px_0px_0px_#000]
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex size-10 shrink-0 items-center justify-center
              border-2 border-black
              bg-white
            "
          >
            <Send className="size-5" />
          </div>

          <div>
            <h2 className="font-black text-sm sm:text-base">{site.telegramTitle}</h2>

            <p className="mt-1 text-sm font-medium leading-5">
              {site.telegramDescription}
            </p>

            <Link
              href={`${telegramUrl}`}
              className="
                mt-3 inline-flex
                border-2 border-black
                bg-white
                px-3 py-1.5
                text-sm font-black
                shadow-[3px_3px_0px_0px_#000]
                transition-all
                hover:translate-x-0.5
                hover:translate-y-0.5
                hover:shadow-none
              "
            >
              {site.telegramTitle}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerNotice;
