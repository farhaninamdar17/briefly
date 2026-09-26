/**
 * In-memory sliding-window rate limiter
 * Edge & Serverless compatible
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMIT_TIERS: Record<string, RateLimitConfig> = {
  auth: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 req / min
  search: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 req / min
  ai: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 req / min
  news: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 req / min
  notifications: { maxRequests: 15, windowMs: 60 * 1000 }, // 15 req / min
  admin: { maxRequests: 40, windowMs: 60 * 1000 }, // 40 req / min
  default: { maxRequests: 60, windowMs: 60 * 1000 },
};

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up stale rate-limit keys to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 120 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function checkRateLimit(
  identifier: string,
  tier: "auth" | "search" | "ai" | "news" | "notifications" | "admin" | "default" = "default"
): RateLimitResult {
  const config = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.default;
  const now = Date.now();
  const key = `${tier}:${identifier}`;

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < config.windowMs);

  const currentCount = record.timestamps.length;
  const reset = Math.ceil((config.windowMs - (now - (record.timestamps[0] || now))) / 1000);

  if (currentCount >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: Math.max(1, reset),
    };
  }

  record.timestamps.push(now);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.timestamps.length,
    reset: Math.max(1, reset),
  };
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
