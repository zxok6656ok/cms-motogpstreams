"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import type { Options } from "plyr";
import "plyr/dist/plyr.css";

type HlsProps = {
  name: string;
  url: string;
  poster?: string;
  autoPlay?: boolean;
};

interface PlyrOptions extends Options {
  quality?: {
    default: number;
    options: number[];
    forced: boolean;
    onChange: (quality: number) => void;
  };
}

type PlyrInstance = {
  destroy: () => void;
};

const HlsPlayer = ({
  name,
  url,
  poster,
  autoPlay = true,
}: HlsProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let hls: Hls | null = null;
    let plyr: PlyrInstance | null = null;

    const init = async () => {
      const Plyr = (await import("plyr")).default;

      if (!videoRef.current) return;

      const video = videoRef.current;

      const defaultOptions: PlyrOptions = {
        ratio: "16:9",

        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],

        settings: ["quality", "speed"],

        quality: {
          default: 0,
          options: [],
          forced: true,
          onChange: () => {},
        },
      };

      if (Hls.isSupported()) {
        hls = new Hls();

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!hls) return;

          const qualities = [
            ...new Set(
              hls.levels
                .map((level) => level.height)
                .filter(
                  (height): height is number =>
                    typeof height === "number" && height > 0
                )
            ),
          ].sort((a, b) => b - a);

          if (qualities.length === 0) {
            plyr = new Plyr(video, defaultOptions);
          } else {
            defaultOptions.quality = {
              default: qualities[0],
              options: qualities,
              forced: true,

              onChange: (quality: number) => {
                if (!hls) return;

                const levelIndex = hls.levels.findIndex(
                  (level) => level.height === quality
                );

                if (levelIndex !== -1) {
                  hls.currentLevel = levelIndex;
                }
              },
            };

            plyr = new Plyr(video, defaultOptions);
          }

          if (autoPlay) {
            video.play().catch(() => {});
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;

        plyr = new Plyr(video, defaultOptions);

        if (autoPlay) {
          video.play().catch(() => {});
        }
      }
    };

    void init();

    return () => {
      hls?.destroy();
      plyr?.destroy();
    };
  }, [url, autoPlay]);

  return (
    <>
      <div className="mx-auto w-full py-1 overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          title={name}
          poster={poster}
          playsInline
          autoPlay={autoPlay}
          className="block h-full w-full"
        />
      </div>

      <style jsx global>{`
        .plyr {
          width: 100%;
          height: 100%;
        }

        .plyr video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>
    </>
  );
};

export default HlsPlayer;