import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";
import { NewsFilterSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(ip, "news");

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
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
    const parsedQuery = NewsFilterSchema.safeParse({
      location: searchParams.get("location") || undefined,
      topic: searchParams.get("topic") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      importance: searchParams.get("importance") || undefined,
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsedQuery.error.format() },
        { status: 400 }
      );
    }

    const stories = dataStore.getStories(parsedQuery.data);

    return NextResponse.json(
      { stories, count: stories.length },
      {
        headers: {
          "X-RateLimit-Limit": rateCheck.limit.toString(),
          "X-RateLimit-Remaining": rateCheck.remaining.toString(),
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Unable to retrieve news at this time." }, { status: 500 });
  }
}
