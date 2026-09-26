"use client";

import React, { useState } from "react";
import Image from "next/image";
import { StoryDTO } from "@/lib/dal/dto";
import {
  X,
  Bookmark,
  Share2,
  Clock,
  MapPin,
  Radio,
  BookOpen,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useSaved } from "@/context/SavedContext";
import { useToast } from "@/context/ToastContext";
import { SourceComparisonCard } from "../news/SourceComparisonCard";
import { DevelopingStoryTimeline } from "../news/DevelopingStoryTimeline";
import { WhyAmISeeingThis } from "../news/WhyAmISeeingThis";

interface StoryDetailModalProps {
  story: StoryDTO | null;
  onClose: () => void;
  onOpenVideo?: (videoId: string) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  onClose,
  onOpenVideo,
}) => {
  const { isStorySaved, toggleSaveStory } = useSaved();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"read" | "listen">("read");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);

  if (!story) return null;

  const saved = isStorySaved(story.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.headline,
        text: story.summary,
        url: window.location.origin + `/story/${story.id}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/story/${story.id}`);
      toast("Story link copied to clipboard", "info");
    }
  };

  const handleBookmark = () => {
    toggleSaveStory(story.id, story.headline);
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    toast(
      isPlayingAudio ? "Audio briefing paused" : "Playing automated AI audio summary...",
      "info"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-editorial-surface rounded-2xl shadow-2xl border border-editorial-border overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-editorial-surface/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-editorial-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {story.topic}
            </span>
            {story.isDeveloping && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white">
                <Radio className="w-3 h-3 animate-pulse" />
                Developing
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mode Switcher: Read / Listen */}
            <div className="flex items-center p-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs mr-2">
              <button
                onClick={() => setActiveTab("read")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-colors ${
                  activeTab === "read"
                    ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read</span>
              </button>
              <button
                onClick={() => setActiveTab("listen")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-colors ${
                  activeTab === "listen"
                    ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-editorial-accent" />
                <span>Listen</span>
              </button>
            </div>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                saved
                  ? "text-editorial-accent bg-editorial-accent/10"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
              aria-label="Bookmark story"
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Share story"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Audio Player Drawer */}
          {activeTab === "listen" && (
            <div className="bg-editorial-accentLight/40 dark:bg-neutral-900 border border-editorial-accent/30 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {isPlayingAudio && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-accent opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-editorial-accent" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-editorial-accentDark dark:text-editorial-accent">
                    AI Voice Briefing (Studio Clear)
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {[1, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed as 1 | 1.25 | 1.5)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        playbackSpeed === speed
                          ? "bg-editorial-accent text-white"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={(e) => setAudioProgress(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-editorial-accent"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>0:45</span>
                  <span>{story.readingTimeMinutes}:00</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => setAudioProgress(Math.max(0, audioProgress - 15))}
                  className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900"
                  aria-label="Skip back 15 seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleAudio}
                  className="w-12 h-12 rounded-full bg-editorial-accent text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                  aria-label={isPlayingAudio ? "Pause briefing" : "Play briefing"}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => setAudioProgress(Math.min(100, audioProgress + 15))}
                  className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900"
                  aria-label="Skip forward 15 seconds"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Headline & Meta */}
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-editorial-accent" />
                {story.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatTimeAgo(story.publishedAt)}
              </span>
              <span>•</span>
              <span>{story.readingTimeMinutes} min read</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-black text-neutral-950 dark:text-neutral-50 leading-tight mb-4">
              {story.headline}
            </h1>

            {story.whyYouSeeThis && (
              <div className="mb-4">
                <WhyAmISeeingThis reason={story.whyYouSeeThis} />
              </div>
            )}
          </div>

          {/* Lead Image */}
          {story.imageUrl && (
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <Image
                src={story.imageUrl}
                alt={story.headline}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          {/* Developing Story Timeline */}
          {story.isDeveloping && story.timeline && (
            <DevelopingStoryTimeline timeline={story.timeline} />
          )}

          {/* Core 4-Part Editorial Clarity */}
          <div className="space-y-5 pt-2">
            <section className="bg-neutral-50 dark:bg-neutral-900/40 rounded-xl p-4 sm:p-5 border border-editorial-border">
              <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
                What happened?
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whatHappened}
              </p>
            </section>

            <section className="bg-neutral-50 dark:bg-neutral-900/40 rounded-xl p-4 sm:p-5 border border-editorial-border">
              <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-editorial-accent" />
                Why it matters
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whyItMatters}
              </p>
            </section>

            <section className="bg-neutral-50 dark:bg-neutral-900/40 rounded-xl p-4 sm:p-5 border border-editorial-border">
              <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Who is affected
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whoIsAffected}
              </p>
            </section>

            <section className="bg-neutral-50 dark:bg-neutral-900/40 rounded-xl p-4 sm:p-5 border border-editorial-border">
              <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                What happens next
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whatHappensNext}
              </p>
            </section>
          </div>

          {/* Multi-Source Comparison */}
          <SourceComparisonCard sources={story.sources} />

          {/* Related Video Briefing Link */}
          {story.relatedVideoId && onOpenVideo && (
            <div className="p-4 rounded-xl bg-neutral-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-editorial-accent flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Watch 60-Second Video Briefing</h4>
                  <p className="text-xs text-neutral-300">Visual breakdown of this story</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenVideo(story.relatedVideoId!);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-colors shrink-0"
              >
                Watch Now
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900 border-t border-editorial-border flex items-center justify-between text-xs text-neutral-500">
          <span>Attributed to {story.sources.length} independent publishers</span>
          <button
            onClick={onClose}
            className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
