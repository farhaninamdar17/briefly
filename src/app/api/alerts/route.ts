import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const alerts = dataStore.getAlerts(activeOnly);

    return NextResponse.json(
      { alerts, count: alerts.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Failed to retrieve official alerts" }, { status: 500 });
  }
}
