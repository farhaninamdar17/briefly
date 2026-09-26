"use client";

import React from "react";
import Image from "next/image";
import { VideoBriefingDTO } from "@/lib/dal/dto";
import { Play, Bookmark, Clock, MapPin } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

interface ShortBriefingCardProps {
  video: VideoBriefingDTO;
  onPlay: (video: VideoBriefingDTO) => void;
}

export const ShortBriefingCard: React.FC<ShortBriefingCardProps> = ({ video, onPlay }) => {
  const { isVideoSaved, toggleSaveVideo } = useSaved();
  const saved = isVideoSaved(video.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveVideo(video.id, video.title);
  };

  return (
    <div
      onClick={() => onPlay(video)}
      className="group cursor-pointer relative shrink-0 w-44 sm:w-52 h-72 sm:h-80 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md hover:scale-[1.02] transition-all duration-300 select-none flex flex-col justify-between p-3.5"
    >
      {/* Background Poster / Thumbnail */}
      <Image
        src={video.thumbnailUrl}
        alt={video.title}
        fill
        sizes="(max-width: 640px) 180px, 220px"
        className="object-cover opacity-80 group-hover:opacity-95 transition-opacity group-hover:scale-105 duration-500"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
          {video.topic}
        </span>

        <button
          onClick={handleBookmark}
          className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
            saved
              ? "bg-editorial-accent text-white"
              : "bg-black/50 text-white/80 hover:text-white hover:bg-black/70"
          }`}
          aria-label={saved ? "Remove video from saved" : "Save video"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Center Play Button Overlay */}
      <div className="relative z-10 flex items-center justify-center my-auto">
        <div className="w-11 h-11 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-editorial-accent group-hover:text-white transition-all duration-200">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-white/70 font-medium">
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-editorial-accent" />
            {video.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {video.durationSeconds}s
          </span>
        </div>

        <h4 className="font-serif text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
          {video.title}
        </h4>

        <span className="text-[11px] text-neutral-400 font-sans truncate">
          {video.channelName}
        </span>
      </div>
    </div>
  );
};
