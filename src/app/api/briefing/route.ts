import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";

export async function GET() {
  try {
    const briefing = dataStore.getDailyBriefing();
    return NextResponse.json(
      { briefing },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Failed to generate daily briefing" }, { status: 500 });
  }
}
