"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserPreferencesDTO } from "@/lib/dal/dto";

interface PreferencesContextType {
  preferences: UserPreferencesDTO;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  updatePreferences: (updates: Partial<UserPreferencesDTO>) => Promise<void>;
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  isCustomizeOpen: boolean;
  openCustomize: () => void;
  closeCustomize: () => void;
}

const DEFAULT_PREFERENCES: UserPreferencesDTO = {
  locations: ["Pune", "Maharashtra", "India"],
  topics: ["Technology", "Science", "Business", "Sports"],
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  pushEnabled: true,
  onlyImportantAlerts: true,
  briefingMode: "read",
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferencesDTO>(DEFAULT_PREFERENCES);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const seenOnboarding = localStorage.getItem("briefly_onboarding_completed");
    if (!seenOnboarding) {
      // Open clean onboarding for first time visitor
      setIsOnboardingOpen(true);
    }

    // Fetch initial preferences from API/LocalStorage
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            setPreferences(data.preferences);
          }
        }
      } catch {
        // Fallback to defaults
      }
    };

    fetchPrefs();
  }, []);

  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => {
    localStorage.setItem("briefly_onboarding_completed", "true");
    setIsOnboardingOpen(false);
  };

  const openCustomize = () => setIsCustomizeOpen(true);
  const closeCustomize = () => setIsCustomizeOpen(false);

  const updatePreferences = async (updates: Partial<UserPreferencesDTO>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);

    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch {
      // Local state is preserved
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        selectedLocation,
        setSelectedLocation,
        selectedTopic,
        setSelectedTopic,
        updatePreferences,
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        isCustomizeOpen,
        openCustomize,
        closeCustomize,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
