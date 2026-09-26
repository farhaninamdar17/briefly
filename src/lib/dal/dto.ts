/**
 * Explicit Data Transfer Objects (DTOs)
 * Strict separation between database records and client-facing shapes.
 * Prevents accidental leak of internal database IDs, internal audit columns, or server secrets.
 */

export type ImportanceLevel = "NORMAL" | "IMPORTANT" | "BREAKING" | "CRITICAL";

export interface StorySourceDTO {
  name: string;
  url: string;
  angle?: string;
  favicon?: string;
}

export interface StoryTimelineEntryDTO {
  id: string;
  time: string;
  event: string;
  source: string;
}

export interface StoryDTO {
  id: string;
  headline: string;
  summary: string;
  whatHappened: string;
  whyItMatters: string;
  whoIsAffected: string;
  whatHappensNext: string;
  location: string;
  topic: string;
  importance: ImportanceLevel;
  isDeveloping: boolean;
  publishedAt: string;
  readingTimeMinutes: number;
  imageUrl?: string;
  sources: StorySourceDTO[];
  timeline?: StoryTimelineEntryDTO[];
  whyYouSeeThis?: string;
  hasAudioBriefing?: boolean;
  audioUrl?: string;
  relatedVideoId?: string;
}

export interface VideoBriefingDTO {
  id: string;
  title: string;
  shortSummary: string;
  channelName: string;
  videoUrl: string; // Embed or authorized source URL
  thumbnailUrl: string;
  durationSeconds: number;
  location: string;
  topic: string;
  publishedAt: string;
  storyId?: string;
}

export interface OfficialAlertDTO {
  id: string;
  authority: string;
  event: string;
  severity: ImportanceLevel;
  area: string;
  timestamp: string;
  expiresAt?: string;
  instructions: string;
  originalUrl: string;
  verified: boolean;
  sourceType: "NDMA_SACHET" | "IMD" | "GOV_CIVIL" | "OFFICIAL_RSS";
}

export interface DailyBriefingItemDTO {
  id: string;
  section: "LOCAL" | "NATIONAL" | "WORLD" | "INTEREST";
  headline: string;
  summary: string;
  location: string;
  topic: string;
  readTime: string;
  storyId: string;
}

export interface DailyBriefingDTO {
  id: string;
  date: string;
  title: string;
  estimatedMinutes: number;
  audioDurationSeconds: number;
  items: DailyBriefingItemDTO[];
}

export interface UserPreferencesDTO {
  locations: string[];
  topics: string[];
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  pushEnabled: boolean;
  onlyImportantAlerts: boolean;
  briefingMode: "read" | "watch" | "listen";
}
