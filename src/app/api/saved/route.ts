import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";
import { z } from "zod";

const SaveToggleSchema = z.object({
  type: z.enum(["story", "video"]),
  id: z.string().min(1),
});

export async function GET() {
  try {
    const savedStoryIds = dataStore.getSavedStoryIds();
    const savedVideoIds = dataStore.getSavedVideoIds();

    const allStories = dataStore.getStories();
    const allVideos = dataStore.getVideos();

    const savedStories = allStories.filter((s) => savedStoryIds.includes(s.id));
    const savedVideos = allVideos.filter((v) => savedVideoIds.includes(v.id));

    return NextResponse.json({
      savedStories,
      savedVideos,
      storyIds: savedStoryIds,
      videoIds: savedVideoIds,
    });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve saved items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SaveToggleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let isSaved: boolean;
    if (parsed.data.type === "story") {
      isSaved = dataStore.toggleSaveStory(parsed.data.id);
    } else {
      isSaved = dataStore.toggleSaveVideo(parsed.data.id);
    }

    return NextResponse.json({
      success: true,
      type: parsed.data.type,
      id: parsed.data.id,
      isSaved,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update saved item" }, { status: 500 });
  }
}
