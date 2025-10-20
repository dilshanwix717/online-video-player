// /src/app/page.tsx
"use client";

import { useState, useMemo } from "react";
import HLSPlayer from "@/components/hls-player";
import VideoInputForm from "@/components/video-input-form";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SAMPLE_HLS =
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

const Home = () => {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = (url: string) => {
    setVideoUrl(url);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setVideoUrl("");
    setIsPlaying(false);
  };

  const handleTryHLS = () => {
    setVideoUrl(SAMPLE_HLS);
    setIsPlaying(true);
  };

  const sourceType = useMemo(() => {
    try {
      const u = new URL(videoUrl);
      if (
        u.pathname.toLowerCase().includes(".m3u8") ||
        u.href.toLowerCase().includes(".m3u8")
      )
        return "hls";
    } catch {}
    return "progressive";
  }, [videoUrl]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 2v4h8V8H6z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">WIXPlayer</h1>
            </div>
            <p className="text-slate-400 text-sm">HLS Video Player</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isPlaying ? (
          // Input Section
          <div className="space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-white text-balance">
                Stream Your HLS Videos
              </h2>
              <p className="text-lg text-slate-400 text-balance">
                Paste your video link and start playing instantly —{" "}
                <span className="font-semibold">.m3u8 (HLS)</span> is
                recommended for the best streaming experience.
              </p>
            </div>

            <VideoInputForm onPlayVideo={handlePlayVideo} />

            {/* Quick HLS CTA */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400 mb-3">
                Want to try HLS right away?
              </p>
              <Button
                onClick={handleTryHLS}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-900 font-semibold rounded-lg shadow-lg"
              >
                Try a sample HLS stream
              </Button>
            </div>
          </div>
        ) : (
          // Player Section
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Now Playing</h2>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      sourceType === "hls"
                        ? "bg-emerald-700 text-emerald-100"
                        : "bg-slate-700 text-slate-200"
                    }`}
                >
                  {sourceType === "hls"
                    ? "HLS (m3u8) — recommended"
                    : "Progressive (mp4/mkv)"}
                </span>
              </div>

              {/* use shadcn Button but keep same appearance via className */}
              <Button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Load New Video
              </Button>
            </div>

            {/* If non-HLS, show gentle suggestion */}
            {sourceType !== "hls" && (
              <Card className="bg-yellow-950/20 border border-yellow-900/30 rounded-lg p-0">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-yellow-200">
                      Tip: For adaptive streaming, lower buffering and better
                      quality switching, try an
                      <span className="font-semibold"> .m3u8 (HLS) </span>{" "}
                      stream. You can
                      <button
                        onClick={handleTryHLS}
                        className="ml-2 underline text-yellow-100"
                      >
                        try a sample HLS stream
                      </button>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Player Container */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
              <HLSPlayer videoSource={videoUrl} />
            </div>

            {/* Video Info */}
            <Card className="bg-slate-900/50 border border-slate-800 rounded-lg p-0">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-2">
                  Video URL
                </h3>
                <p className="text-slate-300 text-sm break-all font-mono bg-slate-950 p-3 rounded border border-slate-800">
                  {videoUrl}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
