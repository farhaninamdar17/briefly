"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StoryDTO, VideoBriefingDTO, OfficialAlertDTO } from "@/lib/dal/dto";
import { usePreferences } from "@/context/PreferencesContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { AreaSelector } from "@/components/news/AreaSelector";
import { TopicSelector } from "@/components/news/TopicSelector";
import { AlertBanner } from "@/components/news/AlertBanner";
import { AlertCard } from "@/components/news/AlertCard";
import { FeaturedStoryCard } from "@/components/news/FeaturedStoryCard";
import { StoryCard } from "@/components/news/StoryCard";
import { ShortBriefingCard } from "@/components/news/ShortBriefingCard";
import { EmptyState } from "@/components/news/EmptyState";
import { LoadingSkeleton } from "@/components/news/LoadingSkeleton";
import { StoryDetailModal } from "@/components/modals/StoryDetailModal";
import { VideoPlayerModal } from "@/components/modals/VideoPlayerModal";
import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { CustomizeModal } from "@/components/modals/CustomizeModal";
import { Sparkles, Video, ShieldAlert, Newspaper, TrendingUp, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { selectedLocation, selectedTopic } = usePreferences();

  const [stories, setStories] = useState<StoryDTO[]>([]);
  const [videos, setVideos] = useState<VideoBriefingDTO[]>([]);
  const [alerts, setAlerts] = useState<OfficialAlertDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStory, setSelectedStory] = useState<StoryDTO | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [storiesRes, videosRes, alertsRes] = await Promise.all([
          fetch(`/api/news?location=${selectedLocation}&topic=${selectedTopic}`),
          fetch("/api/videos"),
          fetch("/api/alerts"),
        ]);

        if (storiesRes.ok) {
          const sData = await storiesRes.json();
          setStories(sData.stories || []);
        }

        if (videosRes.ok) {
          const vData = await videosRes.json();
          setVideos(vData.videos || []);
        }

        if (alertsRes.ok) {
          const aData = await alertsRes.json();
          setAlerts(aData.alerts || []);
        }
      } catch (err) {
        console.error("Failed to load news feed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedLocation, selectedTopic]);

  const featuredStory = stories[0];
  const secondaryStories = stories.slice(1, 4);
  const localStories = stories.slice(4);
  const importantAlerts = alerts.filter((a) => a.severity === "CRITICAL" || a.severity === "BREAKING" || a.severity === "IMPORTANT");

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      {/* Top Warning Alert Banner */}
      <AlertBanner />

      {/* Main Header */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-10">
        {/* Top Control Bar: Area Selector & Topic Filters */}
        <section className="space-y-2 border-b border-editorial-border pb-4">
          <AreaSelector />
          <TopicSelector />
        </section>

        {/* 5-Minute Daily Briefing Quick Hero Widget (Section 27) */}
        <section className="w-full bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-editorial-accent text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-amber-300">
                  Daily 5-Min Digest
                </span>
                <span className="text-xs text-neutral-400">Refreshed for Saturday</span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold mt-1">
                Your 5-Minute Morning Briefing is ready.
              </h2>
              <p className="text-xs text-neutral-300 mt-0.5 max-w-md">
                Local, national, and world headlines synthesized in 4 concise stories.
              </p>
            </div>
          </div>

          <Link
            href="/briefing"
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-editorial-accent text-white font-bold text-xs hover:opacity-90 transition-opacity shadow-md shrink-0"
          >
            <span>Start 5-Minute Briefing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {isLoading ? (
          <LoadingSkeleton />
        ) : stories.length === 0 ? (
          <EmptyState type="stories" />
        ) : (
          <>
            {/* SECTION 1: TOP STORIES (Section 26) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-editorial-accent" />
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
                    Top Stories
                  </h2>
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {stories.length} verified reports
                </span>
              </div>

              {/* Lead Story */}
              {featuredStory && (
                <FeaturedStoryCard
                  story={featuredStory}
                  onSelect={(s) => setSelectedStory(s)}
                />
              )}

              {/* Secondary Lead Cards Grid */}
              {secondaryStories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {secondaryStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onSelect={(s) => setSelectedStory(s)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 2: SHORT BRIEFINGS (Vertical 9:16 Videos - Section 29) */}
            {videos.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-editorial-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-editorial-accent" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
                      Short Video Briefings
                    </h2>
                  </div>
                  <span className="text-xs text-neutral-500">60-second vertical visual updates</span>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {videos.map((vid) => (
                    <ShortBriefingCard
                      key={vid.id}
                      video={vid}
                      onPlay={(v) => setSelectedVideoId(v.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: IMPORTANT FOR YOU & OFFICIAL ALERTS (Section 23, 24, 26) */}
            {importantAlerts.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-editorial-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
                      Official Alerts & Important For You
                    </h2>
                  </div>
                  <Link
                    href="/alerts"
                    className="text-xs font-semibold text-editorial-accent hover:underline flex items-center gap-1"
                  >
                    <span>View All Alerts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importantAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 4: TODAY IN YOUR AREAS (Section 26) */}
            {localStories.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-editorial-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-editorial-accent" />
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
                      Today in Your Areas
                    </h2>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Filtered for {selectedLocation === "all" ? "Pune & Maharashtra" : selectedLocation}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {localStories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onSelect={(s) => setSelectedStory(s)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onOpenVideo={(vidId) => setSelectedVideoId(vidId)}
      />

      {selectedVideoId && (
        <VideoPlayerModal
          videos={videos}
          initialVideoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
          onSelectStory={(sId) => {
            const matched = stories.find((s) => s.id === sId);
            if (matched) setSelectedStory(matched);
          }}
        />
      )}

      <OnboardingModal />
      <CustomizeModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation />

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
