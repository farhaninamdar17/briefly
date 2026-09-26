"use client";

import React from "react";
import Image from "next/image";
import { StoryDTO } from "@/lib/dal/dto";
import { Bookmark, Share2, Clock, MapPin, Radio } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useSaved } from "@/context/SavedContext";
import { useToast } from "@/context/ToastContext";
import { WhyAmISeeingThis } from "./WhyAmISeeingThis";

interface FeaturedStoryCardProps {
  story: StoryDTO;
  onSelect: (story: StoryDTO) => void;
}

export const FeaturedStoryCard: React.FC<FeaturedStoryCardProps> = ({ story, onSelect }) => {
  const { isStorySaved, toggleSaveStory } = useSaved();
  const { toast } = useToast();
  const saved = isStorySaved(story.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveStory(story.id, story.headline);
  };

  return (
    <article
      onClick={() => onSelect(story)}
      className="group cursor-pointer w-full bg-editorial-surface rounded-2xl border border-editorial-border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row"
    >
      {story.imageUrl && (
        <div className="relative w-full md:w-1/2 h-56 sm:h-72 md:h-auto overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
          <Image
            src={story.imageUrl}
            alt={story.headline}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-900/90 text-white backdrop-blur-md">
              {story.topic}
            </span>
            {story.isDeveloping && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-sm">
                <Radio className="w-3 h-3 animate-pulse" />
                Developing
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {story.topic}
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3 h-3 text-editorial-accent" />
                <span>{story.location}</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(story.publishedAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  saved
                    ? "text-editorial-accent bg-editorial-accent/10"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                aria-label={saved ? "Remove bookmark" : "Bookmark story"}
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight leading-tight mb-3 group-hover:text-editorial-accent transition-colors">
            {story.headline}
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3 mb-4 font-sans">
            {story.summary}
          </p>
        </div>

        <div className="pt-4 border-t border-editorial-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              Verified by {story.sources.map((s) => s.name).join(", ")}
            </span>
            <span>•</span>
            <span>{story.readingTimeMinutes} min read</span>
          </div>

          {story.whyYouSeeThis && (
            <WhyAmISeeingThis reason={story.whyYouSeeThis} />
          )}
        </div>
      </div>
    </article>
  );
};
