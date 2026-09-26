"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { StoryCard } from "@/components/news/StoryCard";
import { ShortBriefingCard } from "@/components/news/ShortBriefingCard";
import { EmptyState } from "@/components/news/EmptyState";
import { StoryDetailModal } from "@/components/modals/StoryDetailModal";
import { VideoPlayerModal } from "@/components/modals/VideoPlayerModal";
import { StoryDTO, VideoBriefingDTO } from "@/lib/dal/dto";
import { Bookmark, Video, Newspaper, Loader2 } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

export default function SavedPage() {
  const { savedStoryIds, savedVideoIds } = useSaved();
  const [activeTab, setActiveTab] = useState<"stories" | "videos">("stories");
  const [savedStories, setSavedStories] = useState<StoryDTO[]>([]);
  const [savedVideos, setSavedVideos] = useState<VideoBriefingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStory, setSelectedStory] = useState<StoryDTO | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedItems = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          setSavedStories(data.savedStories || []);
          setSavedVideos(data.savedVideos || []);
        }
      } catch {
        // Ignored
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedItems();
  }, [savedStoryIds, savedVideoIds]);

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-editorial-border pb-6">
          <div className="flex items-center gap-2 text-editorial-accent font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Personal Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 dark:text-neutral-50">
            Saved Stories & Briefings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Access your bookmarked articles and short video briefings anytime.
          </p>
        </div>

        {/* Tab switchers: Stories / Videos */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("stories")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "stories"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Saved Stories ({savedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === "videos"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Saved Videos ({savedVideos.length})</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-neutral-400 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-editorial-accent" />
            <span>Loading archive...</span>
          </div>
        ) : (
          <>
            {/* Content Render */}
            {activeTab === "stories" && (
              <div>
                {savedStories.length === 0 ? (
                  <EmptyState type="saved" message="You have no saved stories." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {savedStories.map((story) => (
                      <StoryCard
                        key={story.id}
                        story={story}
                        onSelect={(s) => setSelectedStory(s)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "videos" && (
              <div>
                {savedVideos.length === 0 ? (
                  <EmptyState type="saved" message="You have no saved video briefings." />
                ) : (
                  <div className="flex items-center gap-4 flex-wrap">
                    {savedVideos.map((video) => (
                      <ShortBriefingCard
                        key={video.id}
                        video={video}
                        onPlay={(v) => setSelectedVideoId(v.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {selectedVideoId && (
        <VideoPlayerModal
          videos={savedVideos}
          initialVideoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}

      <MobileNavigation />
      <Footer />
    </div>
  );
}
