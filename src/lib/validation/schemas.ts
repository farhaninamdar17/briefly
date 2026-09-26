import { z } from "zod";

// External URL validator schema
export const SafeUrlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
        const host = parsed.hostname.toLowerCase();
        if (
          host === "localhost" ||
          host === "127.0.0.1" ||
          host === "0.0.0.0" ||
          host === "169.254.169.254" ||
          host.endsWith(".localhost") ||
          host.endsWith(".local")
        ) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },
    { message: "URL points to an unsafe or forbidden network target" }
  );

// News query / filter schema
export const NewsFilterSchema = z.object({
  location: z.string().max(50).optional().default("all"),
  topic: z.string().max(50).optional().default("all"),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
  importance: z.enum(["all", "normal", "important", "breaking", "critical"]).optional().default("all"),
});

// Search query schema
export const SearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(100, "Query too long"),
  location: z.string().max(50).optional(),
  topic: z.string().max(50).optional(),
});

// User preference update schema
export const UserPreferencesSchema = z.object({
  locations: z.array(z.string().max(50)).min(1, "At least one location required").max(10),
  topics: z.array(z.string().max(50)).min(1, "At least one topic required").max(15),
  quietHoursEnabled: z.boolean().default(false),
  quietHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default("22:00"),
  quietHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default("07:00"),
  pushEnabled: z.boolean().default(true),
  onlyImportantAlerts: z.boolean().default(true),
  briefingMode: z.enum(["read", "watch", "listen"]).default("read"),
});

// Official Disaster Alert schema
export const AlertCreateSchema = z.object({
  authority: z.string().min(2).max(100),
  event: z.string().min(3).max(150),
  severity: z.enum(["NORMAL", "IMPORTANT", "BREAKING", "CRITICAL"]),
  area: z.string().min(2).max(100),
  instructions: z.string().min(5).max(1000),
  originalUrl: SafeUrlSchema,
  expiresAt: z.string().datetime().optional(),
});

// Story Create / Edit Schema
export const StoryCreateSchema = z.object({
  headline: z.string().min(5).max(200),
  summary: z.string().min(10).max(1000),
  whatHappened: z.string().min(10).max(2000),
  whyItMatters: z.string().min(10).max(2000),
  whoIsAffected: z.string().min(10).max(1000),
  whatHappensNext: z.string().min(10).max(1000),
  location: z.string().min(2).max(50),
  topic: z.string().min(2).max(50),
  importance: z.enum(["NORMAL", "IMPORTANT", "BREAKING", "CRITICAL"]).default("NORMAL"),
  isDeveloping: z.boolean().default(false),
  imageUrl: SafeUrlSchema.optional(),
  sources: z
    .array(
      z.object({
        name: z.string().min(2).max(100),
        url: SafeUrlSchema,
        angle: z.string().max(200).optional(),
      })
    )
    .min(1, "At least one verified source is required"),
  timeline: z
    .array(
      z.object({
        time: z.string(),
        event: z.string(),
        source: z.string(),
      })
    )
    .optional(),
});

// Video Curation Schema
export const VideoCreateSchema = z.object({
  title: z.string().min(5).max(200),
  shortSummary: z.string().min(10).max(500),
  channelName: z.string().min(2).max(100),
  videoUrl: SafeUrlSchema,
  thumbnailUrl: SafeUrlSchema,
  durationSeconds: z.number().int().min(5).max(180),
  location: z.string().max(50).default("Global"),
  topic: z.string().max(50).default("General"),
  storyId: z.string().optional(),
});

// Auth login / register schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  locations: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
});
