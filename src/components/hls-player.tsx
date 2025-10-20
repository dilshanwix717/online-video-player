"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    const Plyr = window.Plyr;
    const Hls = window.Hls;
    let hlsInstance: any = null;
    let plyrInstance: any = null;

    const isHls = videoSource?.toLowerCase().includes(".m3u8");
    const canPlayNative = (type: string) => video.canPlayType(type) !== "";

    (async () => {
      try {
        if (isHls) {
          // HLS path (existing)
          if (!Hls || !Plyr) {
            setError("Player libraries not loaded yet.");
            setIsLoading(false);
            return;
          }

          if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(videoSource);
            hlsInstance.attachMedia(video);

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
              plyrInstance = new Plyr(video, {
                /* your controls */
              });
              setIsLoading(false);
            });

            hlsInstance.on(Hls.Events.ERROR, (event: any, data: any) => {
              if (data.fatal) {
                setError("Failed to load HLS stream.");
                setIsLoading(false);
              }
            });
          } else if (canPlayNative("application/vnd.apple.mpegurl")) {
            // Safari native
            video.src = videoSource;
            plyrInstance = new Plyr(video);
            setIsLoading(false);
          } else {
            setError("HLS not supported in this browser.");
            setIsLoading(false);
          }
        } else {
          // Direct file (mp4, mkv, webm, etc.)
          // Prefer MP4 (H.264/AAC) for compatibility.
          video.src = videoSource;

          // Quick capability check
          if (
            videoSource.toLowerCase().endsWith(".mp4") &&
            canPlayNative("video/mp4")
          ) {
            plyrInstance = new Plyr(video, {
              /* controls */
            });
            // load metadata to know when ready
            video.addEventListener(
              "loadedmetadata",
              () => setIsLoading(false),
              { once: true }
            );
            video.addEventListener(
              "error",
              () => {
                setError("Cannot play this MP4 file in this browser.");
                setIsLoading(false);
              },
              { once: true }
            );
          } else if (videoSource.toLowerCase().endsWith(".mkv")) {
            // Try to play MKV — may fail depending on browser
            if (
              canPlayNative("video/webm") ||
              canPlayNative("video/ogg") ||
              canPlayNative("video/mp4")
            ) {
              plyrInstance = new Plyr(video, {
                /* controls */
              });
              video.addEventListener(
                "loadedmetadata",
                () => setIsLoading(false),
                { once: true }
              );
              video.addEventListener(
                "error",
                () => {
                  setError(
                    "This MKV isn't playable in your browser. Convert to MP4 (H.264/AAC) for best compatibility."
                  );
                  setIsLoading(false);
                },
                { once: true }
              );
            } else {
              setError(
                "MKV playback not supported in this browser. Convert to MP4 (H.264/AAC)."
              );
              setIsLoading(false);
            }
          } else {
            // other formats (webm...) — try to play and handle error
            plyrInstance = new Plyr(video, {
              /* controls */
            });
            video.addEventListener(
              "loadedmetadata",
              () => setIsLoading(false),
              { once: true }
            );
            video.addEventListener(
              "error",
              () => {
                setError("Cannot play this file type in your browser.");
                setIsLoading(false);
              },
              { once: true }
            );
          }
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while initializing the player.");
        setIsLoading(false);
      }
    })();

    return () => {
      try {
        if (hlsInstance) hlsInstance.destroy();
      } catch {}
      try {
        if (plyrInstance && typeof plyrInstance.destroy === "function")
          plyrInstance.destroy();
      } catch {}
      video.removeAttribute("src");
      video.load();
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

      <video ref={videoRef} className="w-full h-auto" controls />
    </div>
  );
};

export default HLSPlayer;
