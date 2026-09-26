import React from "react";
import { StorySourceDTO } from "@/lib/dal/dto";
import { ExternalLink, Layers } from "lucide-react";

interface SourceComparisonCardProps {
  sources: StorySourceDTO[];
}

export const SourceComparisonCard: React.FC<SourceComparisonCardProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-900/60 rounded-xl p-4 sm:p-5 border border-editorial-border my-4">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-editorial-accent" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
          Source Transparency & Perspectives ({sources.length} Independent Reports)
        </h4>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
        We synthesize verified facts across independent newsrooms without ranking publishers. Compare reported angles below:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sources.map((src, index) => (
          <div
            key={index}
            className="flex flex-col justify-between bg-white dark:bg-neutral-950 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  {src.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 uppercase">
                  Source #{index + 1}
                </span>
              </div>

              {src.angle && (
                <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed mb-3 italic">
                  &ldquo;{src.angle}&rdquo;
                </p>
              )}
            </div>

            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-editorial-accent hover:underline text-[11px] pt-2 border-t border-neutral-100 dark:border-neutral-900"
            >
              <span>Read on {src.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
