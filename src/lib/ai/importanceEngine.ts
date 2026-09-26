import { ImportanceLevel } from "../dal/dto";
import { RawArticle } from "../news/providers/types";

export interface ImportanceFactors {
  isOfficialAlert: boolean;
  independentSourceCount: number;
  hasDevelopingFlag: boolean;
  containsCriticalKeywords: boolean;
  publicationRecencyHours: number;
}

const CRITICAL_KEYWORDS = [
  "evacuate",
  "disaster",
  "earthquake",
  "cyclone",
  "tsunami",
  "flash flood",
  "curfew",
  "emergency declaration",
];

const BREAKING_KEYWORDS = [
  "just in",
  "breaking",
  "urgent",
  "airspace closed",
  "treaty signed",
  "emergency landing",
];

/**
 * Conservative Importance Engine
 * High threshold for notifications to prevent alert fatigue.
 */
export function calculateImportanceLevel(
  title: string,
  description: string,
  sources: RawArticle[],
  isDeveloping: boolean = false
): ImportanceLevel {
  const combinedText = `${title} ${description}`.toLowerCase();

  // 1. Critical Disaster / Safety Warning
  const hasCriticalKeyword = CRITICAL_KEYWORDS.some((kw) => combinedText.includes(kw));
  if (hasCriticalKeyword && sources.length >= 1) {
    return "CRITICAL";
  }

  // 2. Breaking News with multiple independent sources
  const hasBreakingKeyword = BREAKING_KEYWORDS.some((kw) => combinedText.includes(kw));
  if (hasBreakingKeyword && sources.length >= 2) {
    return "BREAKING";
  }

  // 3. Important Regional / National development with 2+ verifying sources
  if (sources.length >= 3 || (isDeveloping && sources.length >= 2)) {
    return "IMPORTANT";
  }

  // Default is Normal - most daily news remains in Normal category
  return "NORMAL";
}
