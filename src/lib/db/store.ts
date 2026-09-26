import {
  StoryDTO,
  VideoBriefingDTO,
  OfficialAlertDTO,
  DailyBriefingDTO,
  UserPreferencesDTO,
} from "../dal/dto";
import { MOCK_STORIES } from "../data/mockStories";
import { MOCK_VIDEOS } from "../data/mockVideos";
import { MOCK_ALERTS } from "../data/mockAlerts";
import { MOCK_DAILY_BRIEFING } from "../data/mockBriefings";

// In-memory persistent state (persists across hot-reloads and API calls)
class BrieflyDataStore {
  private stories: StoryDTO[] = [...MOCK_STORIES];
  private videos: VideoBriefingDTO[] = [...MOCK_VIDEOS];
  private alerts: OfficialAlertDTO[] = [...MOCK_ALERTS];
  private dailyBriefing: DailyBriefingDTO = { ...MOCK_DAILY_BRIEFING };
  private userSavedStories: Set<string> = new Set(["story_pune_metro_01"]);
  private userSavedVideos: Set<string> = new Set(["vid_pune_metro_01"]);
  private userPreferences: UserPreferencesDTO = {
    locations: ["Pune", "Maharashtra", "India"],
    topics: ["Technology", "Science", "Business", "Sports"],
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    pushEnabled: true,
    onlyImportantAlerts: true,
    briefingMode: "read",
  };

  // STORIES
  public getStories(filters?: {
    location?: string;
    topic?: string;
    importance?: string;
    limit?: number;
    offset?: number;
  }): StoryDTO[] {
    let result = [...this.stories];

    if (filters?.location && filters.location !== "all" && filters.location !== "All") {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        (s) =>
          s.location.toLowerCase() === loc ||
          (loc === "maharashtra" && (s.location.toLowerCase() === "pune" || s.location.toLowerCase() === "mumbai")) ||
          (loc === "india" && (s.location.toLowerCase() === "pune" || s.location.toLowerCase() === "mumbai" || s.location.toLowerCase() === "maharashtra"))
      );
    }

    if (filters?.topic && filters.topic !== "all" && filters.topic !== "All") {
      const top = filters.topic.toLowerCase();
      result = result.filter((s) => s.topic.toLowerCase() === top);
    }

    if (filters?.importance && filters.importance !== "all") {
      const imp = filters.importance.toUpperCase();
      result = result.filter((s) => s.importance === imp);
    }

    // Sort by publication recency
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;

    return result.slice(offset, offset + limit);
  }

  public getStoryById(id: string): StoryDTO | null {
    return this.stories.find((s) => s.id === id) || null;
  }

  public addStory(story: StoryDTO): StoryDTO {
    this.stories.unshift(story);
    return story;
  }

  public updateStory(id: string, updates: Partial<StoryDTO>): StoryDTO | null {
    const index = this.stories.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.stories[index] = { ...this.stories[index], ...updates };
    return this.stories[index];
  }

  public deleteStory(id: string): boolean {
    const initialLen = this.stories.length;
    this.stories = this.stories.filter((s) => s.id !== id);
    return this.stories.length < initialLen;
  }

  public searchStories(query: string, location?: string, topic?: string): StoryDTO[] {
    const q = query.toLowerCase().trim();
    return this.stories.filter((s) => {
      const matchesQuery =
        s.headline.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.whatHappened.toLowerCase().includes(q) ||
        s.sources.some((src) => src.name.toLowerCase().includes(q));

      const matchesLocation =
        !location || location === "all" || s.location.toLowerCase() === location.toLowerCase();
      const matchesTopic =
        !topic || topic === "all" || s.topic.toLowerCase() === topic.toLowerCase();

      return matchesQuery && matchesLocation && matchesTopic;
    });
  }

  // VIDEOS
  public getVideos(location?: string, topic?: string): VideoBriefingDTO[] {
    let result = [...this.videos];
    if (location && location !== "all") {
      result = result.filter((v) => v.location.toLowerCase() === location.toLowerCase());
    }
    if (topic && topic !== "all") {
      result = result.filter((v) => v.topic.toLowerCase() === topic.toLowerCase());
    }
    return result;
  }

  public addVideo(video: VideoBriefingDTO): VideoBriefingDTO {
    this.videos.unshift(video);
    return video;
  }

  // ALERTS
  public getAlerts(activeOnly: boolean = true): OfficialAlertDTO[] {
    const now = new Date().getTime();
    if (!activeOnly) return [...this.alerts];
    return this.alerts.filter((a) => {
      if (!a.expiresAt) return true;
      return new Date(a.expiresAt).getTime() > now;
    });
  }

  public addAlert(alert: OfficialAlertDTO): OfficialAlertDTO {
    this.alerts.unshift(alert);
    return alert;
  }

  public deleteAlert(id: string): boolean {
    const initLen = this.alerts.length;
    this.alerts = this.alerts.filter((a) => a.id !== id);
    return this.alerts.length < initLen;
  }

  // DAILY BRIEFING
  public getDailyBriefing(): DailyBriefingDTO {
    return this.dailyBriefing;
  }

  // PREFERENCES
  public getUserPreferences(): UserPreferencesDTO {
    return { ...this.userPreferences };
  }

  public updateUserPreferences(updates: Partial<UserPreferencesDTO>): UserPreferencesDTO {
    this.userPreferences = { ...this.userPreferences, ...updates };
    return this.userPreferences;
  }

  // SAVED
  public getSavedStoryIds(): string[] {
    return Array.from(this.userSavedStories);
  }

  public toggleSaveStory(storyId: string): boolean {
    if (this.userSavedStories.has(storyId)) {
      this.userSavedStories.delete(storyId);
      return false;
    } else {
      this.userSavedStories.add(storyId);
      return true;
    }
  }

  public getSavedVideoIds(): string[] {
    return Array.from(this.userSavedVideos);
  }

  public toggleSaveVideo(videoId: string): boolean {
    if (this.userSavedVideos.has(videoId)) {
      this.userSavedVideos.delete(videoId);
      return false;
    } else {
      this.userSavedVideos.add(videoId);
      return true;
    }
  }
}

// Global singleton to preserve state across development requests
const globalForBriefly = globalThis as unknown as {
  brieflyStore: BrieflyDataStore | undefined;
};

export const dataStore = globalForBriefly.brieflyStore ?? new BrieflyDataStore();

if (process.env.NODE_ENV !== "production") {
  globalForBriefly.brieflyStore = dataStore;
}
