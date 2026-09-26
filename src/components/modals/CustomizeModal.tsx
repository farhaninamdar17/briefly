"use client";

import React, { useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";
import { X, Check, MapPin, Sparkles, Bell } from "lucide-react";

const ALL_AREAS = [
  "Pune",
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Maharashtra",
  "India",
  "World",
];

const ALL_TOPICS = [
  "Technology",
  "Science",
  "Business",
  "Sports",
  "Politics",
  "Climate & Environment",
  "Healthcare",
  "Culture",
];

export const CustomizeModal: React.FC = () => {
  const { isCustomizeOpen, closeCustomize, preferences, updatePreferences } = usePreferences();

  const [locations, setLocations] = useState<string[]>(preferences.locations);
  const [topics, setTopics] = useState<string[]>(preferences.topics);
  const [quietHours, setQuietHours] = useState(preferences.quietHoursEnabled);
  const [onlyImportant, setOnlyImportant] = useState(preferences.onlyImportantAlerts);

  if (!isCustomizeOpen) return null;

  const toggleLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? (prev.length > 1 ? prev.filter((l) => l !== loc) : prev) : [...prev, loc]
    );
  };

  const toggleTopic = (top: string) => {
    setTopics((prev) =>
      prev.includes(top) ? (prev.length > 1 ? prev.filter((t) => t !== top) : prev) : [...prev, top]
    );
  };

  const handleSave = async () => {
    await updatePreferences({
      locations,
      topics,
      quietHoursEnabled: quietHours,
      onlyImportantAlerts: onlyImportant,
    });
    closeCustomize();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-editorial-surface rounded-3xl shadow-2xl border border-editorial-border p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-editorial-border mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-neutral-950 dark:text-neutral-50">
              Customize Your Briefing
            </h2>
            <p className="text-xs text-neutral-500">
              Fine-tune your locations, topics, and quiet hours.
            </p>
          </div>
          <button
            onClick={closeCustomize}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Close customization"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Locations */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            <MapPin className="w-4 h-4 text-editorial-accent" />
            <span>Followed Areas</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_AREAS.map((loc) => {
              const isSelected = locations.includes(loc);
              return (
                <button
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-editorial-accent" />}
                  <span>{loc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Topics */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            <Sparkles className="w-4 h-4 text-editorial-accent" />
            <span>Key Interests</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_TOPICS.map((top) => {
              const isSelected = topics.includes(top);
              return (
                <button
                  key={top}
                  onClick={() => toggleTopic(top)}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-editorial-accent text-white font-semibold"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{top}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Notification controls */}
        <div className="space-y-3 mb-6 pt-4 border-t border-editorial-border">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            <Bell className="w-4 h-4 text-editorial-accent" />
            <span>Alert Preferences</span>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 cursor-pointer">
              <span>Important & Critical Alerts Only</span>
              <input
                type="checkbox"
                checked={onlyImportant}
                onChange={(e) => setOnlyImportant(e.target.checked)}
                className="w-4 h-4 accent-editorial-accent"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 cursor-pointer">
              <span>Quiet Hours (10:00 PM – 7:00 AM)</span>
              <input
                type="checkbox"
                checked={quietHours}
                onChange={(e) => setQuietHours(e.target.checked)}
                className="w-4 h-4 accent-editorial-accent"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-editorial-border">
          <button
            onClick={closeCustomize}
            className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-editorial-accent text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
