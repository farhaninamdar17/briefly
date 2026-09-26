"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { StoryCard } from "@/components/news/StoryCard";
import { EmptyState } from "@/components/news/EmptyState";
import { StoryDetailModal } from "@/components/modals/StoryDetailModal";
import { StoryDTO } from "@/lib/dal/dto";
import { Search, Compass, TrendingUp, X, Loader2 } from "lucide-react";

const TOPICS = [
  "All Topics",
  "Technology",
  "Science",
  "Business",
  "Sports",
];

const LOCATIONS = [
  "All Locations",
  "Pune",
  "Mumbai",
  "Maharashtra",
  "India",
  "World",
];

const TRENDING_SIGNALS = [
  "Hinjawadi Metro Trial",
  "DHRUVA-X Quantum Chip",
  "Mumbai Tidal Storm Gate",
  "1000s Fusion Record",
  "UPI European Linkage",
  "Ranji AI Ball Tracking",
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [stories, setStories] = useState<StoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<StoryDTO | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const topicParam = selectedTopic === "All Topics" ? "all" : selectedTopic;
        const locParam = selectedLocation === "All Locations" ? "all" : selectedLocation;
        const res = await fetch(`/api/news?location=${locParam}&topic=${topicParam}`);
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories || []);
        }
      } catch {
        // Ignored
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, [selectedTopic, selectedLocation]);

  const filteredStories = stories.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.headline.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.sources.some((src) => src.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Page Header */}
        <div className="border-b border-editorial-border pb-6">
          <div className="flex items-center gap-2 text-editorial-accent font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Discover & Deep-Dive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 dark:text-neutral-50">
            Explore Topics & Areas
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Browse verified coverage across specialized beats, urban infrastructure, and regional developments.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, technologies, organizations..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-editorial-surface border border-editorial-border text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-editorial-accent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trending Signals */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
            <TrendingUp className="w-3.5 h-3.5 text-editorial-accent" />
            <span>Trending Signals in Your Areas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SIGNALS.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 rounded-full text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
              >
                #{term}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Filter Pills */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-neutral-400 shrink-0">Topic:</span>
            {TOPICS.map((top) => (
              <button
                key={top}
                onClick={() => setSelectedTopic(top)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedTopic === top
                    ? "bg-editorial-accent text-white shadow-xs"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                }`}
              >
                {top}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-neutral-400 shrink-0">Area:</span>
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  selectedLocation === loc
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <section className="space-y-4 pt-4 border-t border-editorial-border">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Showing {filteredStories.length} stories</span>
            {(selectedTopic !== "All Topics" || selectedLocation !== "All Locations" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTopic("All Topics");
                  setSelectedLocation("All Locations");
                  setSearchQuery("");
                }}
                className="font-semibold text-editorial-accent hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-neutral-400 gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-editorial-accent" />
              <span>Filtering topics...</span>
            </div>
          ) : filteredStories.length === 0 ? (
            <EmptyState
              type="stories"
              message="No stories matched your filters."
              actionText="Reset filters"
              onAction={() => {
                setSelectedTopic("All Topics");
                setSelectedLocation("All Locations");
                setSearchQuery("");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onSelect={(s) => setSelectedStory(s)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      <MobileNavigation />
      <Footer />
    </div>
  );
}
