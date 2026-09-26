import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location") || undefined;
    const topic = searchParams.get("topic") || undefined;

    const videos = dataStore.getVideos(location, topic);

    return NextResponse.json(
      { videos, count: videos.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Failed to retrieve video briefings" }, { status: 500 });
  }
}
