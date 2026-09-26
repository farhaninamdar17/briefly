"use client";

import React from "react";
import Image from "next/image";
import { StoryDTO } from "@/lib/dal/dto";
import { MapPin } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";

interface CompactStoryCardProps {
  story: StoryDTO;
  onSelect: (story: StoryDTO) => void;
}

export const CompactStoryCard: React.FC<CompactStoryCardProps> = ({ story, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(story)}
      className="group cursor-pointer flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-xl bg-editorial-surface border border-editorial-border hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-150"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
          <span className="font-semibold text-editorial-accent uppercase tracking-wider">
            {story.topic}
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" />
            {story.location}
          </span>
          <span>•</span>
          <span>{formatTimeAgo(story.publishedAt)}</span>
        </div>

        <h4 className="font-serif text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-editorial-accent transition-colors line-clamp-2">
          {story.headline}
        </h4>
      </div>

      {story.imageUrl && (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
          <Image
            src={story.imageUrl}
            alt={story.headline}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}
    </article>
  );
};
