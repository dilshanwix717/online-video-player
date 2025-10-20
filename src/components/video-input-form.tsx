// /src/components/video-input-form.tsx
"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Play, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface VideoInputFormProps {
  onPlayVideo: (url: string) => void;
}

const SAMPLE_HLS =
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

const EXTENSIONS = [
  ".m3u8",
  ".mp4",
  ".mkv",
  ".webm",
  ".mov",
  ".avi",
  ".flv",
  ".ogg",
];

const isValidVideoUrl = (urlString: string) => {
  try {
    const urlObj = new URL(urlString);
    return EXTENSIONS.some((ext) => urlObj.href.toLowerCase().includes(ext));
  } catch {
    return false;
  }
};

const isM3u8 = (urlString: string) => {
  try {
    const urlObj = new URL(urlString);
    return urlObj.href.toLowerCase().includes(".m3u8");
  } catch {
    return false;
  }
};

const VideoInputForm: React.FC<VideoInputFormProps> = ({ onPlayVideo }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const detectedM3u8 = useMemo(() => isM3u8(url), [url]);
  const isValid = useMemo(() => isValidVideoUrl(url), [url]);

  useEffect(() => {
    // clear error when user types
    if (error) setError("");
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a video URL");
      return;
    }

    if (!isValid) {
      setError(
        "Please enter a valid video URL (e.g. .mp4, .mkv, .webm, .m3u8)"
      );
      return;
    }

    setIsLoading(true);
    // small UX delay to show loading state
    setTimeout(() => {
      onPlayVideo(url.trim());
      setIsLoading(false);
    }, 450);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Input Field */}
      <div className="space-y-3">
        <Label
          htmlFor="video-url"
          className="block text-sm font-medium text-slate-300"
        >
          Video URL
        </Label>

        <div className="relative">
          <Input
            id="video-url"
            value={url}
            onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
            placeholder={SAMPLE_HLS}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          {/* Recommendation badge */}
          {url && (
            <div className="absolute right-2 top-2 flex items-center gap-2 text-xs">
              {detectedM3u8 ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-800 text-emerald-100 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> HLS ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-700 text-slate-100 font-medium">
                  <Info className="w-3.5 h-3.5" /> Not HLS
                </span>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Tip: <span className="font-semibold">.m3u8</span> files are
          recommended for adaptive streaming (lower buffering & smooth quality
          switching). Progressive files like{" "}
          <span className="font-semibold">.mp4</span> still work and are good
          for simple playback.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-950/30 border border-red-900/50 rounded-lg p-0">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !isValid}
        className={`w-full px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed ${
          detectedM3u8
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
            : "bg-gradient-to-r from-slate-700 to-slate-600 text-white"
        }`}
      >
        <Play className="w-5 h-5" />
        {isLoading
          ? "Loading..."
          : detectedM3u8
          ? "Play HLS (recommended)"
          : "Play Video"}
      </Button>

      {/* Example URLs */}
      <div className="pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-3">Example Video URLs:</p>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setUrl(SAMPLE_HLS)}
              className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded transition-colors duration-200 font-mono break-all"
            >
              {SAMPLE_HLS}
            </Button>

            <Button
              variant="ghost"
              type="button"
              onClick={() =>
                setUrl("https://www.w3schools.com/html/mov_bbb.mp4")
              }
              className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded transition-colors duration-200 font-mono break-all"
            >
              https://www.w3schools.com/html/mov_bbb.mp4
            </Button>
          </div>
        </div>

        {/* Small accessibility / encouragement note */}
        <p className="mt-3 text-xs text-slate-500">
          Not sure which to use? Start with the sample HLS stream above — it
          demonstrates adaptive streaming (best for network variation). If you
          have a single-file asset, MP4 works fine too.
        </p>
      </div>
    </form>
  );
};

export default VideoInputForm;
