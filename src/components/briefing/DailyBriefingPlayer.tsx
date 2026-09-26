"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DailyBriefingDTO, DailyBriefingItemDTO } from "@/lib/dal/dto";
import {
  Sparkles,
  BookOpen,
  Volume2,
  Video,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Share2,
  Clock,
  RotateCcw,
  Flame,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface DailyBriefingPlayerProps {
  briefing: DailyBriefingDTO;
  onSelectStory?: (storyId: string) => void;
}

export const DailyBriefingPlayer: React.FC<DailyBriefingPlayerProps> = ({
  briefing,
  onSelectStory,
}) => {
  const [activeMode, setActiveMode] = useState<"read" | "listen" | "watch">("read");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [streakCount, setStreakCount] = useState(4);
  const { toast } = useToast();

  const totalItems = briefing.items.length;
  const currentItem: DailyBriefingItemDTO = briefing.items[currentIndex] || briefing.items[0];

  const handleNext = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      setStreakCount((prev) => prev + 1);
      toast("🎉 Daily briefing complete! Streak updated.", "success");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShareStreak = () => {
    const text = `I just finished my 5-minute daily news briefing on BRIEFLY! 🔥 ${streakCount}-day streak.`;
    if (navigator.share) {
      navigator.share({ title: "BRIEFLY Daily Briefing", text, url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast("Streak summary copied to clipboard!", "info");
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 sm:p-10 rounded-3xl bg-editorial-surface border border-editorial-border shadow-xl text-center space-y-6 animate-slide-up my-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            All Caught Up for Today
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 dark:text-neutral-50 mt-1">
            You&apos;re ready for the day.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-2 leading-relaxed">
            You covered all essential local, national, and world developments in under 5 minutes.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center gap-3">
          <Flame className="w-7 h-7 text-amber-500 fill-current animate-bounce" />
          <div className="text-left">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm block">
              {streakCount}-Day Daily Reading Streak!
            </span>
            <span className="text-xs text-neutral-500">
              Keep it up tomorrow at 7:00 AM.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentIndex(0);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-editorial-border text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Briefing</span>
          </button>

          <button
            onClick={handleShareStreak}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-editorial-accent text-white text-xs font-bold hover:opacity-90 shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share My Brief</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:opacity-90"
          >
            Back to Home Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-editorial-surface border border-editorial-border shadow-xl overflow-hidden my-6">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-6 border-b border-editorial-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="font-serif font-black text-base sm:text-lg text-neutral-950 dark:text-neutral-50">
            5-Minute Daily Briefing
          </span>
        </div>

        {/* 3 Modes: READ / WATCH / LISTEN (Section 27 & 30) */}
        <div className="flex items-center p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold">
          <button
            onClick={() => setActiveMode("read")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              activeMode === "read"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Read</span>
          </button>

          <button
            onClick={() => setActiveMode("listen")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              activeMode === "listen"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-editorial-accent" />
            <span className="hidden sm:inline">Listen</span>
          </button>

          <button
            onClick={() => setActiveMode("watch")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              activeMode === "watch"
                ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Watch</span>
          </button>
        </div>
      </div>

      {/* Progress Bars (1 for each story item) */}
      <div className="px-6 pt-4 flex gap-1.5">
        {briefing.items.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx < currentIndex
                ? "bg-neutral-900 dark:bg-white"
                : idx === currentIndex
                ? "bg-editorial-accent"
                : "bg-neutral-200 dark:bg-neutral-800"
            }`}
          />
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 space-y-4">
        {/* Section Pill: LOCAL / NATIONAL / WORLD / INTEREST */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            {currentItem.section} FOCUS • {currentItem.location}
          </span>
          <div className="flex items-center gap-1 text-xs text-neutral-400 font-mono">
            <Clock className="w-3 h-3" />
            <span>Story {currentIndex + 1} of {totalItems}</span>
          </div>
        </div>

        {/* Listen Audio Mode Waveform / Player */}
        {activeMode === "listen" && (
          <div className="p-4 rounded-2xl bg-editorial-accentLight/30 dark:bg-neutral-900 border border-editorial-accent/30 flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-12 h-12 rounded-full bg-editorial-accent text-white flex items-center justify-center hover:scale-105 transition-transform shrink-0"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div>
                <span className="text-xs font-bold text-editorial-accentDark dark:text-editorial-accent block">
                  Automated Audio Narration
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isPlayingAudio ? "Broadcasting high-definition voice briefing..." : "Click play to listen"}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-500">0:45 / {currentItem.readTime}</span>
          </div>
        )}

        {/* Headline */}
        <h3 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 dark:text-neutral-50 leading-tight">
          {currentItem.headline}
        </h3>

        {/* Concise AI Summary */}
        <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
          {currentItem.summary}
        </p>

        {/* Link to deep-dive story */}
        {onSelectStory && (
          <div className="pt-2">
            <button
              onClick={() => onSelectStory(currentItem.storyId)}
              className="text-xs font-bold text-editorial-accent hover:underline"
            >
              Read full deep-dive & source comparison &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border-t border-editorial-border flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-neutral-400 font-mono">
          Est. total: {briefing.estimatedMinutes} mins
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-editorial-accent text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md"
        >
          <span>{currentIndex === totalItems - 1 ? "Complete Briefing" : "Next Story"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
