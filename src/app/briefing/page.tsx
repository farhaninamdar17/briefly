"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { DailyBriefingPlayer } from "@/components/briefing/DailyBriefingPlayer";
import { StoryDetailModal } from "@/components/modals/StoryDetailModal";
import { DailyBriefingDTO, StoryDTO } from "@/lib/dal/dto";
import { MOCK_DAILY_BRIEFING } from "@/lib/data/mockBriefings";
import { Loader2 } from "lucide-react";

export default function DailyBriefingPage() {
  const [briefing, setBriefing] = useState<DailyBriefingDTO>(MOCK_DAILY_BRIEFING);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<StoryDTO | null>(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const res = await fetch("/api/briefing");
        if (res.ok) {
          const data = await res.json();
          if (data.briefing) setBriefing(data.briefing);
        }
      } catch {
        // Fallback to mock
      } finally {
        setIsLoading(false);
      }
    };

    fetchBriefing();
  }, []);

  const handleSelectStory = async (storyId: string) => {
    try {
      const res = await fetch(`/api/news/${storyId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.story) setSelectedStory(data.story);
      }
    } catch {
      // Ignored
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="text-center max-w-lg mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-editorial-accent block mb-1">
            Curated 5-Minute Digest
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-950 dark:text-neutral-50">
            Today&apos;s Essential Brief
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            4 critical stories across your areas and key interests. Choose to Read, Watch, or Listen.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-editorial-accent" />
            <span>Compiling daily brief...</span>
          </div>
        ) : (
          <DailyBriefingPlayer
            briefing={briefing}
            onSelectStory={handleSelectStory}
          />
        )}
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
