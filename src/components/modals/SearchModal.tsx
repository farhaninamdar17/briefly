"use client";

import React, { useState, useEffect } from "react";
import { StoryDTO } from "@/lib/dal/dto";
import { Search, X, Clock, MapPin, Loader2 } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { StoryDetailModal } from "./StoryDetailModal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryDTO | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-20 bg-black/70 backdrop-blur-xs animate-fade-in">
        <div className="relative w-full max-w-2xl bg-editorial-surface rounded-2xl shadow-2xl border border-editorial-border overflow-hidden flex flex-col max-h-[80vh]">
          {/* Search Input Bar */}
          <div className="p-4 border-b border-editorial-border flex items-center gap-3">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Pune, Semiconductor, Fusion, Cricket..."
              autoFocus
              className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto p-4 space-y-3 flex-1">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-neutral-400 gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-editorial-accent" />
                <span>Searching verified news index...</span>
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No verified stories match &ldquo;{query}&rdquo;. Try another location or keyword.
              </div>
            )}

            {!isLoading && !query && (
              <div className="py-6 px-2 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Suggested Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Pune Metro", "Semiconductor", "Mumbai Coastal", "Fusion Energy", "Chess Olympiad"].map(
                    (suggested) => (
                      <button
                        key={suggested}
                        onClick={() => setQuery(suggested)}
                        className="px-3 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        {suggested}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {results.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors border border-transparent hover:border-editorial-border"
              >
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                  <span className="font-semibold text-editorial-accent uppercase">
                    {story.topic}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {story.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimeAgo(story.publishedAt)}
                  </span>
                </div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                  {story.headline}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-1">
                  {story.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedStory && (
        <StoryDetailModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
};
