"use client";

import React from "react";
import Image from "next/image";
import { StoryDTO } from "@/lib/dal/dto";
import { Bookmark, Share2, Clock, MapPin, Radio } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useSaved } from "@/context/SavedContext";
import { useToast } from "@/context/ToastContext";
import { WhyAmISeeingThis } from "./WhyAmISeeingThis";

interface StoryCardProps {
  story: StoryDTO;
  onSelect: (story: StoryDTO) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
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
      toast("Story link copied", "info");
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveStory(story.id, story.headline);
  };

  return (
    <article
      onClick={() => onSelect(story)}
      className="group cursor-pointer w-full bg-editorial-surface rounded-xl border border-editorial-border overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {story.imageUrl && (
          <div className="relative w-full h-44 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={story.imageUrl}
              alt={story.headline}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900/80 text-white backdrop-blur-xs">
                {story.topic}
              </span>
              {story.isDeveloping && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <MapPin className="w-3 h-3 text-editorial-accent" />
              <span>{story.location}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(story.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleBookmark}
                className={`p-1.5 rounded-full transition-colors ${
                  saved
                    ? "text-editorial-accent bg-editorial-accent/10"
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
                aria-label={saved ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50 leading-snug group-hover:text-editorial-accent transition-colors mb-2 line-clamp-2">
            {story.headline}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed mb-3">
            {story.summary}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center justify-between">
          <span className="truncate max-w-[200px]">
            {story.sources.map((s) => s.name).join(" • ")}
          </span>
          <span className="shrink-0">{story.readingTimeMinutes}m read</span>
        </div>

        {story.whyYouSeeThis && (
          <WhyAmISeeingThis reason={story.whyYouSeeThis} />
        )}
      </div>
    </article>
  );
};
