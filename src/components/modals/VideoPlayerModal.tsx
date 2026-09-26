"use client";

import React, { useState } from "react";
import Image from "next/image";
import { VideoBriefingDTO } from "@/lib/dal/dto";
import { X, Bookmark, Share2, ChevronUp, ChevronDown, ExternalLink, Play, Sparkles } from "lucide-react";
import { useSaved } from "@/context/SavedContext";
import { useToast } from "@/context/ToastContext";

interface VideoPlayerModalProps {
  videos: VideoBriefingDTO[];
  initialVideoId?: string;
  onClose: () => void;
  onSelectStory?: (storyId: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  videos,
  initialVideoId,
  onClose,
  onSelectStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialVideoId) return 0;
    const found = videos.findIndex((v) => v.id === initialVideoId);
    return found !== -1 ? found : 0;
  });
  const [isPlaying, setIsPlaying] = useState(true);

  const { isVideoSaved, toggleSaveVideo } = useSaved();
  const { toast } = useToast();

  if (!videos || videos.length === 0) return null;
  const currentVideo = videos[currentIndex] || videos[0];
  const saved = isVideoSaved(currentVideo.id);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentVideo.title,
        text: currentVideo.shortSummary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Video briefing link copied", "info");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      {/* Close button top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-colors"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Container - 9:16 vertical ratio phone shell */}
      <div className="relative w-full max-w-sm h-full sm:h-[86vh] sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col justify-between">
        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {currentVideo.topic} • {currentVideo.location}
          </span>
        </div>

        {/* Video / Player Area */}
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <Image
            src={currentVideo.thumbnailUrl}
            alt={currentVideo.title}
            fill
            sizes="400px"
            className="object-cover opacity-60"
          />

          {/* Animated Waveform / Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

          {/* Center Play / Pause Indicator */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-20 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <div className="w-6 h-6 flex items-center justify-between px-1">
                <span className="w-1.5 h-5 bg-white rounded-xs animate-pulse" />
                <span className="w-1.5 h-5 bg-white rounded-xs animate-pulse" />
              </div>
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>
        </div>

        {/* Right Side Vertical Action Bar */}
        <div className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center gap-4">
          <button
            onClick={() => toggleSaveVideo(currentVideo.id, currentVideo.title)}
            className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              saved
                ? "bg-editorial-accent text-white"
                : "bg-black/60 text-white hover:bg-black/80"
            }`}
            aria-label="Save video"
          >
            <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-transform active:scale-90"
            aria-label="Share video"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Overlay Context & Captions */}
        <div className="relative z-30 p-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 text-white">
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
            <span className="font-semibold text-white">{currentVideo.channelName}</span>
            <span>•</span>
            <span>{currentVideo.durationSeconds}s Briefing</span>
          </div>

          <h3 className="font-serif text-lg font-bold leading-snug">
            {currentVideo.title}
          </h3>

          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed font-sans">
            {currentVideo.shortSummary}
          </p>

          {/* Related story button */}
          {currentVideo.storyId && onSelectStory && (
            <button
              onClick={() => {
                onClose();
                onSelectStory(currentVideo.storyId!);
              }}
              className="mt-1 flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white transition-colors"
            >
              <span>Read Full Deep-Dive Story</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Next / Prev buttons */}
          <div className="flex items-center justify-between pt-2 text-xs text-neutral-400 border-t border-white/10 mt-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-[11px] font-mono">
              {currentIndex + 1} / {videos.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === videos.length - 1}
              className="flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
            >
              <span>Next</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
