"use client";

import React, { useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";
import { MapPin, Sparkles, ShieldAlert, Check, ArrowRight, X } from "lucide-react";

const AVAILABLE_LOCATIONS = [
  "Pune",
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Maharashtra",
  "India",
  "World",
];

const AVAILABLE_TOPICS = [
  "Technology",
  "Science",
  "Business",
  "Sports",
  "Politics",
  "Climate & Environment",
  "Healthcare",
  "Culture",
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, preferences, updatePreferences } = usePreferences();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedLocs, setSelectedLocs] = useState<string[]>(preferences.locations);
  const [selectedTops, setSelectedTops] = useState<string[]>(preferences.topics);
  const [onlyImportant, setOnlyImportant] = useState(preferences.onlyImportantAlerts);
  const [quietHours, setQuietHours] = useState(preferences.quietHoursEnabled);

  if (!isOnboardingOpen) return null;

  const toggleLocation = (loc: string) => {
    setSelectedLocs((prev) =>
      prev.includes(loc) ? (prev.length > 1 ? prev.filter((l) => l !== loc) : prev) : [...prev, loc]
    );
  };

  const toggleTopic = (top: string) => {
    setSelectedTops((prev) =>
      prev.includes(top) ? (prev.length > 1 ? prev.filter((t) => t !== top) : prev) : [...prev, top]
    );
  };

  const handleFinish = async () => {
    await updatePreferences({
      locations: selectedLocs,
      topics: selectedTops,
      onlyImportantAlerts: onlyImportant,
      quietHoursEnabled: quietHours,
    });
    closeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-editorial-surface rounded-3xl shadow-2xl border border-editorial-border p-6 sm:p-8 overflow-hidden">
        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-editorial-accent"
                    : s < step
                    ? "w-4 bg-neutral-900 dark:bg-white"
                    : "w-4 bg-neutral-200 dark:bg-neutral-800"
                }`}
              />
            ))}
          </div>

          <button
            onClick={closeOnboarding}
            className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen 1: Where should we look? */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <div className="flex items-center gap-2 text-editorial-accent font-semibold text-xs tracking-wider uppercase">
              <MapPin className="w-4 h-4" />
              <span>Step 1 of 3</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight leading-snug">
              Where should we look?
            </h2>

            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Select the cities, states, or regions you live in or care about. You can always change this later.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {AVAILABLE_LOCATIONS.map((loc) => {
                const isSelected = selectedLocs.includes(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => toggleLocation(loc)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-editorial-accent" />}
                    <span>{loc}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-editorial-accent text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 2: What do you care about? */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <div className="flex items-center gap-2 text-editorial-accent font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Step 2 of 3</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight leading-snug">
              What do you care about?
            </h2>

            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Choose your key interests. We prioritize substantial developments over sensational noise.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {AVAILABLE_TOPICS.map((top) => {
                const isSelected = selectedTops.includes(top);
                return (
                  <button
                    key={top}
                    onClick={() => toggleTopic(top)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-editorial-accent text-white font-semibold shadow-xs"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{top}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-editorial-accent text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 3: Only alert me when it matters */}
        {step === 3 && (
          <div className="space-y-5 animate-slide-up">
            <div className="flex items-center gap-2 text-editorial-accent font-semibold text-xs tracking-wider uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>Step 3 of 3</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight leading-snug">
              Only alert me when it matters.
            </h2>

            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Zero spam. We only dispatch push notifications for verified official disaster warnings and critical breakthroughs.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 block">
                    Important Alerts Only
                  </span>
                  <span className="text-xs text-neutral-500">
                    Filter out routine notifications; notify only for high-impact events.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyImportant}
                  onChange={(e) => setOnlyImportant(e.target.checked)}
                  className="w-4 h-4 rounded text-editorial-accent accent-editorial-accent"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-editorial-border cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 block">
                    Quiet Hours (10:00 PM – 7:00 AM)
                  </span>
                  <span className="text-xs text-neutral-500">
                    Mute all non-critical alerts while you rest.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={quietHours}
                  onChange={(e) => setQuietHours(e.target.checked)}
                  className="w-4 h-4 rounded text-editorial-accent accent-editorial-accent"
                />
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                Back
              </button>

              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-7 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-black text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Build My Brief</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
