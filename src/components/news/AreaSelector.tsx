"use client";

import React from "react";
import { usePreferences } from "@/context/PreferencesContext";
import { MapPin, SlidersHorizontal } from "lucide-react";

export const AreaSelector: React.FC = () => {
  const { preferences, selectedLocation, setSelectedLocation, openCustomize } = usePreferences();

  const locations = ["all", ...preferences.locations, "World"];
  // Deduplicate case-insensitively
  const uniqueLocations = Array.from(new Set(locations.map((l) => l.trim())));

  return (
    <div className="w-full flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center gap-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mr-1 pl-0.5">
          <MapPin className="w-3.5 h-3.5 text-editorial-accent" />
          <span>Your Brief:</span>
        </div>

        {uniqueLocations.map((loc) => {
          const isSelected =
            selectedLocation.toLowerCase() === loc.toLowerCase() ||
            (selectedLocation === "all" && loc.toLowerCase() === "all");

          const label = loc.toLowerCase() === "all" ? "All My Areas" : loc;

          return (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc.toLowerCase() === "all" ? "all" : loc)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 shrink-0 ${
                isSelected
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        onClick={openCustomize}
        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-editorial-border transition-colors"
        aria-label="Customize locations and interests"
      >
        <SlidersHorizontal className="w-3 h-3" />
        <span className="hidden sm:inline">Customize</span>
      </button>
    </div>
  );
};
