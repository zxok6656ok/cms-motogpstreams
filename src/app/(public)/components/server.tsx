"use client";

import type { Prisma } from "@/generated/prisma/client";

export type PostsStream = Prisma.StreamGetPayload<{
  select: {
    name: true;
    type: true;
    url: true;
    drmId: true,
    drmKey: true
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
  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-black uppercase">
          Server
        </span>

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
              onClick={() => onServerChange(server.name)}
              className={`
                border-2 border-black
                px-4 py-2
                text-sm font-black
                transition-all
                ${
                  active
                    ? "translate-x-1 translate-y-1 bg-[#4d7aff] text-black shadow-none"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#4d7aff] hover:shadow-[2px_2px_0px_0px_#000]"
                }
              `}
            >
              {server.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}