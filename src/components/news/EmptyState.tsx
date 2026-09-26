import React from "react";
import { Newspaper, Video, ShieldCheck, MapPin, SlidersHorizontal } from "lucide-react";

interface EmptyStateProps {
  type?: "stories" | "videos" | "alerts" | "areas" | "saved";
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "stories",
  message,
  actionText,
  onAction,
}) => {
  const configs = {
    stories: {
      icon: Newspaper,
      defaultTitle: "Nothing important yet. Check back soon.",
      defaultDesc: "We only show stories that genuinely matter. When new verified reports emerge, they will appear here.",
    },
    videos: {
      icon: Video,
      defaultTitle: "No suitable briefing videos found.",
      defaultDesc: "Short vertical briefings for your selected areas will appear once verified video reports are indexed.",
    },
    alerts: {
      icon: ShieldCheck,
      defaultTitle: "No important alerts for your areas.",
      defaultDesc: "Official disaster management and weather emergency feeds report calm conditions.",
    },
    areas: {
      icon: MapPin,
      defaultTitle: "Choose the places that matter to you.",
      defaultDesc: "Follow your city, state, or country to build a personalized daily news brief.",
    },
    saved: {
      icon: Newspaper,
      defaultTitle: "No saved items yet.",
      defaultDesc: "Bookmark stories and video briefings to read or watch them at your convenience.",
    },
  };

  const current = configs[type] || configs.stories;
  const Icon = current.icon;

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-editorial-surface border border-editorial-border my-6">
      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
        {message || current.defaultTitle}
      </h3>

      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-4 leading-relaxed">
        {current.defaultDesc}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
