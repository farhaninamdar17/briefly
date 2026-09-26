import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = dataStore.getStoryById(id);

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch {
    return NextResponse.json({ error: "Failed to fetch story details" }, { status: 500 });
  }
}
