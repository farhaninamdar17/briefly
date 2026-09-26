"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

interface SavedContextType {
  savedStoryIds: string[];
  savedVideoIds: string[];
  isStorySaved: (id: string) => boolean;
  isVideoSaved: (id: string) => boolean;
  toggleSaveStory: (id: string, title?: string) => Promise<boolean>;
  toggleSaveVideo: (id: string, title?: string) => Promise<boolean>;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedStoryIds, setSavedStoryIds] = useState<string[]>(["story_pune_metro_01"]);
  const [savedVideoIds, setSavedVideoIds] = useState<string[]>(["vid_pune_metro_01"]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch("/api/saved");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.storyIds)) setSavedStoryIds(data.storyIds);
          if (Array.isArray(data.videoIds)) setSavedVideoIds(data.videoIds);
        }
      } catch {
        // Preserves local defaults
      }
    };
    fetchSaved();
  }, []);

  const isStorySaved = (id: string) => savedStoryIds.includes(id);
  const isVideoSaved = (id: string) => savedVideoIds.includes(id);

  const toggleSaveStory = async (id: string, title?: string): Promise<boolean> => {
    const isCurrentlySaved = savedStoryIds.includes(id);
    const nextSaved = isCurrentlySaved
      ? savedStoryIds.filter((sId) => sId !== id)
      : [...savedStoryIds, id];

    setSavedStoryIds(nextSaved);
    toast(
      isCurrentlySaved
        ? `Removed "${title ? title.slice(0, 30) + "..." : "Story"}" from saved`
        : `Saved "${title ? title.slice(0, 30) + "..." : "Story"}" for later`,
      "success"
    );

    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "story", id }),
      });
    } catch {
      // Local state preserved
    }

    return !isCurrentlySaved;
  };

  const toggleSaveVideo = async (id: string, title?: string): Promise<boolean> => {
    const isCurrentlySaved = savedVideoIds.includes(id);
    const nextSaved = isCurrentlySaved
      ? savedVideoIds.filter((vId) => vId !== id)
      : [...savedVideoIds, id];

    setSavedVideoIds(nextSaved);
    toast(
      isCurrentlySaved
        ? `Removed "${title ? title.slice(0, 30) + "..." : "Video"}" from saved`
        : `Saved video briefing for later`,
      "success"
    );

    try {
      await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "video", id }),
      });
    } catch {
      // Local state preserved
    }

    return !isCurrentlySaved;
  };

  return (
    <SavedContext.Provider
      value={{
        savedStoryIds,
        savedVideoIds,
        isStorySaved,
        isVideoSaved,
        toggleSaveStory,
        toggleSaveVideo,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSaved must be used within SavedProvider");
  }
  return context;
}
