"use client";

import React from "react";
import { usePreferences } from "@/context/PreferencesContext";

export const TopicSelector: React.FC = () => {
  const { preferences, selectedTopic, setSelectedTopic } = usePreferences();

  const topics = ["all", ...preferences.topics];
  const uniqueTopics = Array.from(new Set(topics));

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      {uniqueTopics.map((top) => {
        const isSelected =
          selectedTopic.toLowerCase() === top.toLowerCase() ||
          (selectedTopic === "all" && top.toLowerCase() === "all");

        const label = top.toLowerCase() === "all" ? "All Topics" : top;

        return (
          <button
            key={top}
            onClick={() => setSelectedTopic(top.toLowerCase() === "all" ? "all" : top)}
            className={`px-3 py-1 rounded-full text-xs transition-all duration-150 shrink-0 ${
              isSelected
                ? "bg-editorial-accent text-white font-semibold shadow-sm"
                : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-editorial-border"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
