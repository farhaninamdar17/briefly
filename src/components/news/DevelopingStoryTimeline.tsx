import React from "react";
import { StoryTimelineEntryDTO } from "@/lib/dal/dto";
import { Clock, Radio } from "lucide-react";

interface DevelopingStoryTimelineProps {
  timeline?: StoryTimelineEntryDTO[];
}

export const DevelopingStoryTimeline: React.FC<DevelopingStoryTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="w-full bg-amber-50/40 dark:bg-amber-950/10 rounded-xl p-4 sm:p-5 border border-amber-200/70 dark:border-amber-900/40 my-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
        </span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-rose-600" />
          Developing Story • Real-time Timeline
        </h4>
      </div>

      <div className="relative pl-6 space-y-4 border-l-2 border-amber-300 dark:border-amber-800 ml-2">
        {timeline.map((entry, idx) => (
          <div key={entry.id || idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-neutral-900 border-2 border-editorial-accent" />

            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-semibold mb-0.5">
              <Clock className="w-3 h-3" />
              <span>{entry.time}</span>
              <span>•</span>
              <span className="text-editorial-accent">{entry.source}</span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-snug">
              {entry.event}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
