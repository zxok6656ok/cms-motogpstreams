"use client";

import type { Prisma } from "@/generated/prisma/client";
import { Server, CheckCircle2, Wifi } from "lucide-react";
import { AdsSectionProps } from "../../../../lib/ads";

export type PostsStream = Prisma.IframeGetPayload<{
  select: {
    title: true;
    src: true;
    isActive: true;
  };
}>[];

type ServerButtonsProps = {
  servers: PostsStream;
  activeServer: string;
  ads: AdsSectionProps[];
  onServerChange: (server: string) => void;
};

export function ServerButtons({
  servers,
  activeServer,
  onServerChange,
  ads,
}: ServerButtonsProps) {
  const onClickServer = (server: string, active: boolean) => {
    onServerChange(server);
    const popunder = ads.find((ad) => ad.position === "popunder");

    if (active && popunder && !sessionStorage.getItem("adShown")) {
      window.open(popunder.url, "_blank");
      sessionStorage.setItem("adShown", "true");
    }
  };

  const sortedServers = [...servers].sort((a, b) => {
    const numA = a.title.match(/\d+/);
    const numB = b.title.match(/\d+/);

    if (numA && numB) {
      return Number(numA[0]) - Number(numB[0]);
    }

    if (numA) return -1;
    if (numB) return 1;

    return a.title.localeCompare(b.title);
  });
 

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Server className="size-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Server</h3>
            <p className="text-xs text-muted-foreground">
              Pilih server untuk memutar video
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          <Wifi className="size-3.5" />
          {servers.some((server) => server.isActive) ? "Online" : "Offline"}
        </span>
      </div>

      {/* Server buttons */}
      <div className="flex flex-wrap gap-2">
        {sortedServers.map((server) => {
          const selected = activeServer === server.title;
          const available = Boolean(server.isActive);

          return (
            <button
              key={server.title}
              type="button"
              onClick={() => onClickServer(server.title, available)}
              aria-pressed={selected}
              className={`
                inline-flex min-h-10 items-center gap-2
                rounded-lg border px-3.5 py-2
                text-sm font-medium
                transition-all duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                }
                ${!available ? "opacity-60" : ""}
              `}
            >
              <Server className="size-4 shrink-0" />

              <span>{server.title}</span>

              {selected && <CheckCircle2 className="size-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
