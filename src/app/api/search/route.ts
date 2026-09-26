import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";
import { SearchQuerySchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";
import { sanitizeSearchQuery } from "@/lib/security/sanitize";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(ip, "search");

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Search rate limit exceeded. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": rateCheck.reset.toString(),
          "X-RateLimit-Limit": rateCheck.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";
    const sanitizedQ = sanitizeSearchQuery(rawQuery);

    const parsed = SearchQuerySchema.safeParse({
      q: sanitizedQ,
      location: searchParams.get("location") || undefined,
      topic: searchParams.get("topic") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search query", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const results = dataStore.searchStories(
      parsed.data.q,
      parsed.data.location,
      parsed.data.topic
    );

    return NextResponse.json({
      query: parsed.data.q,
      results,
      count: results.length,
    });
  } catch {
    return NextResponse.json({ error: "Search service unavailable." }, { status: 500 });
  }
}
