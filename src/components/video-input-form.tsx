"use client";

import type React from "react";

import { useState } from "react";
import { AlertCircle, Play } from "lucide-react";

interface VideoInputFormProps {
  onPlayVideo: (url: string) => void;
}

export default function VideoInputForm({ onPlayVideo }: VideoInputFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      // Check if it's an HLS URL (ends with .m3u8)
      return urlObj.href.includes(".m3u8") || urlString.includes(".m3u8");
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a video URL");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid HLS URL (must contain .m3u8)");
      return;
    }

    setIsLoading(true);
    // Simulate a brief loading state
    setTimeout(() => {
      onPlayVideo(url);
      setIsLoading(false);
    }, 500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Input Field */}
      <div className="space-y-3">
        <label
          htmlFor="video-url"
          className="block text-sm font-medium text-slate-300"
        >
          HLS Video URL
        </label>
        <div className="relative">
          <input
            id="video-url"
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="https://example.com/video.m3u8"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <p className="text-xs text-slate-500">
          Enter a valid HLS stream URL (must end with .m3u8)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-950/30 border border-red-900/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        <Play className="w-5 h-5" />
        {isLoading ? "Loading..." : "Play Video"}
      </button>

      {/* Example URLs */}
      <div className="pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-3">Example HLS URLs:</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() =>
              setUrl("https://test-streams.mux.dev/x36xhzz/x3ksqt.m3u8")
            }
            className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded transition-colors duration-200 font-mono break-all"
          >
            https://test-streams.mux.dev/x36xhzz/x3ksqt.m3u8
          </button>
        </div>
      </div>
    </form>
  );
}
