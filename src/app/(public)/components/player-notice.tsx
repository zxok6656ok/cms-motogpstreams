
import Link from "next/link";
import { AlertTriangle, Send, ArrowUpRight } from "lucide-react";
import { PlayerSite } from "./player";

const PlayerNotice = ({ site }: { site: PlayerSite }) => {
  if (!site) return null;

  const telegramUrl = site.socialLinks.find(
    (social) => social.platform === "telegram",
  )?.url;

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {/* Player notice */}
      <div className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {site.playerNoticeTitle}
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {site.playerNoticeDescription}
          </p>
        </div>
      </div>

      {/* Telegram */}
      <div className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Send className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {site.telegramTitle}
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {site.telegramDescription}
          </p>

          {telegramUrl && (
            <Link
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-3 inline-flex items-center gap-2
                rounded-lg bg-primary px-3.5 py-2
                text-sm font-medium text-primary-foreground
                transition-colors
                hover:bg-primary/90
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
              "
            >
              {site.telegramTitle}
              <ArrowUpRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerNotice;
