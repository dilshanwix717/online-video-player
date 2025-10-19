"use client";

import { useState } from "react";
import HLSPlayer from "@/components/hls-player";
import VideoInputForm from "@/components/video-input-form";

export default function Home() {
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
              <h1 className="text-2xl font-bold text-white">StreamPlay</h1>
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
                Paste your HLS video link and start playing instantly
              </p>
            </div>

            <VideoInputForm onPlayVideo={handlePlayVideo} />
          </div>
        ) : (
          // Player Section
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Now Playing</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Load New Video
              </button>
            </div>

            {/* Video Player Container */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
              <HLSPlayer videoSource={videoUrl} />
            </div>

            {/* Video Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">
                Video URL
              </h3>
              <p className="text-slate-300 text-sm break-all font-mono bg-slate-950 p-3 rounded border border-slate-800">
                {videoUrl}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
