"use client";

import type { Prisma } from "@/generated/prisma/client";
import { Server } from "lucide-react";

export type PostsStream = Prisma.StreamGetPayload<{
  select: {
    name: true;
    type: true;
    url: true;
    drmId: true;
    drmKey: true;
    directLink: true;
    directLinkActive: true;
  };
}>[];

type ServerButtonsProps = {
  servers: PostsStream;
  activeServer: string;
  onServerChange: (server: string) => void;
};

export function ServerButtons({
  servers,
  activeServer,
  onServerChange,
}: ServerButtonsProps) {
  const onClickServer = (
    server: string,
    directLink: string,
    active: boolean,
  ) => {
    onServerChange(server);
    if (active) {
      if (!sessionStorage.getItem("adShown")) {
        window.open(directLink, "_blank");
        sessionStorage.setItem("adShown", "true");
      }
    }
  };
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-black uppercase">Server</span>

        <span
          className="
            border-2 border-black
            bg-green-400
            px-2 py-0.5
            text-xs font-black
          "
        >
          ONLINE
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {servers.map((server) => {
          const active = activeServer === server.name;

          return (
            <button
              key={server.name}
              type="button"
              onClick={() =>
                onClickServer(
                  server.name,
                  server.directLink ?? "",
                  server.directLinkActive ?? false,
                )
              }
              className={`
                border-2 border-black
                px-4 py-2
                text-sm font-black
                transition-all
                flex gap-1 items-center
                ${
                  active
                    ? "translate-x-1 translate-y-1 bg-[#4d7aff] text-black shadow-none"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#4d7aff] hover:shadow-[2px_2px_0px_0px_#000]"
                }
              `}
            >
              <Server className="w-5 h-5" /> {server.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
