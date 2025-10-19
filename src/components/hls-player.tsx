"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import "./hls-player.css";

declare global {
  interface Window {
    Plyr: any;
    Hls: any;
  }
}

interface HLSPlayerProps {
  videoSource: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ videoSource }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (!window.Plyr || !window.Hls) {
      console.log("[v0] Waiting for Plyr and HLS.js to load...");
      return;
    }

    const video = videoRef.current;
    const Hls = window.Hls;
    const Plyr = window.Plyr;
    let hls: any = null;

    try {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoSource);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const player = new Plyr(video, {
            controls: [
              "play-large",
              "restart",
              "rewind",
              "play",
              "fast-forward",
              "progress",
              "current-time",
              "duration",
              "mute",
              "volume",
              "settings",
              "pip",
              "fullscreen",
            ],
            quality: {
              default: hls.levels[0]?.height || 720,
              options: hls.levels.map((level: any) => level.height),
              forced: true,
              onChange: (newQuality: number) => {
                hls.levels.forEach((level: any, levelIndex: number) => {
                  if (level.height === newQuality) {
                    hls.currentLevel = levelIndex;
                  }
                });
              },
            },
          });

          setIsLoading(false);
          setError(null);
        });

        hls.on(Hls.Events.ERROR, (event: any, data: any) => {
          if (data.fatal) {
            setError("Failed to load video. Please check the URL.");
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS support
        video.src = videoSource;
        const player = new Plyr(video, {
          controls: [
            "play-large",
            "restart",
            "rewind",
            "play",
            "fast-forward",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            "pip",
            "fullscreen",
          ],
        });
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred while loading the video.");
      setIsLoading(false);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSource]);

  return (
    <div className="relative w-full bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <p className="text-red-400 text-sm mb-2">⚠️ Error</p>
            <p className="text-slate-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-auto"
        style={{ display: isLoading || error ? "none" : "block" }}
      />
    </div>
  );
};

export default HLSPlayer;
