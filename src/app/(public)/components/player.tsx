"use client";

import { useState } from "react";
import { ServerButtons } from "./server";
import PlayerNotice from "./player-notice";
import type { Prisma } from "@/generated/prisma/client";
import { Posts } from "../[...slug]/page";
import Hls from "./hls";
import Dash from "./dash";
import { Calendar, TextIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export type PlayerSite = Prisma.SiteSettingGetPayload<{
  select: {
    playerNoticeTitle: true;
    playerNoticeDescription: true;
    telegramTitle: true;
    telegramDescription: true;
    socialLinks: true;
  };
}>;

export default function Player({
  posts,
  site,
}: {
  posts: Posts;
  site: PlayerSite;
}) {
  const [activeServer, setActiveServer] = useState(
    posts.streams[0]?.name ?? "",
  );

  const activeStream = posts.streams.find(
    (stream) => stream.name === activeServer,
  );

  const createdAt = new Date(posts.createdAt);
  return (
    <section className="mx-auto mb-10 w-full max-w-6xl px-4 py-6 sm:mb-20">
      <h2
        className="
              mb-1
              min-h-14
              line-clamp-2
              text-xl
              font-black
              leading-tight
              tracking-tight
              sm:text-2xl
              flex gap-1 items-center
            "
      >
        <TextIcon />
        {posts.title}
      </h2>
      <div className="flex gap-1 items-center mb-2">
        <Calendar />
        <time
          dateTime={createdAt.toISOString()}
          className="text-xs font-black uppercase"
        >
          {format(createdAt, "dd MMM yyyy", {
            locale: id,
          })}
        </time>
      </div>
      <div
        className="
          overflow-hidden
          border-2 border-black
          bg-black
          shadow-[6px_6px_0px_0px_#000]
        "
      >
        <div className="relative aspect-video w-full p-0">
          {/* player */}
          {activeStream ? (
            <div className="flex h-full items-center justify-center p-0 text-white">
              {activeStream.type == "hls" ? (
                <Hls
                  name={activeStream.name}
                  url={activeStream.url}
                  poster={posts.poster ?? ""}
                />
              ) : (
                <Dash
                  name={activeStream.name}
                  url={activeStream.url}
                  drmId={activeStream.drmId ?? undefined}
                  drmKey={activeStream.drmKey ?? undefined}
                  poster={posts.poster ?? ""}
                />
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-white">
              Stream tidak tersedia
            </div>
          )}
        </div>
      </div>

      <PlayerNotice site={site} />

      <ServerButtons
        servers={posts.streams}
        activeServer={activeServer}
        onServerChange={setActiveServer}
      />
    </section>
  );
}
