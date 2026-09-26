import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasRequiredRole } from "@/lib/security/auth";
import { dataStore } from "@/lib/db/store";
import { StoryCreateSchema } from "@/lib/validation/schemas";
import { logAuditEvent } from "@/lib/security/auditLog";
import { getClientIp } from "@/lib/security/rateLimiter";
import { StoryDTO } from "@/lib/dal/dto";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized: Editor or Admin role required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = StoryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const storyData = parsed.data;
    const newStory: StoryDTO = {
      id: `story_custom_${Date.now()}`,
      headline: storyData.headline,
      summary: storyData.summary,
      whatHappened: storyData.whatHappened,
      whyItMatters: storyData.whyItMatters,
      whoIsAffected: storyData.whoIsAffected,
      whatHappensNext: storyData.whatHappensNext,
      location: storyData.location,
      topic: storyData.topic,
      importance: storyData.importance,
      isDeveloping: storyData.isDeveloping,
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: Math.max(1, Math.ceil(storyData.whatHappened.split(" ").length / 180)),
      imageUrl: storyData.imageUrl,
      sources: storyData.sources,
      timeline: storyData.timeline?.map((t, idx) => ({
        id: `tl_${idx}`,
        time: t.time,
        event: t.event,
        source: t.source,
      })),
      whyYouSeeThis: `You follow ${storyData.location} and ${storyData.topic}.`,
    };

    dataStore.addStory(newStory);

    logAuditEvent({
      adminId: user.id,
      adminEmail: user.email,
      action: "STORY_CREATE",
      targetType: "STORY",
      targetId: newStory.id,
      result: "SUCCESS",
      metadata: { headline: newStory.headline },
      ipHash: getClientIp(request),
    });

    return NextResponse.json({ success: true, story: newStory }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error while saving story" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized: Admin role required to delete." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get("id");

  if (!storyId) {
    return NextResponse.json({ error: "Story ID required" }, { status: 400 });
  }

  const deleted = dataStore.deleteStory(storyId);

  logAuditEvent({
    adminId: user.id,
    adminEmail: user.email,
    action: "STORY_DELETE",
    targetType: "STORY",
    targetId: storyId,
    result: deleted ? "SUCCESS" : "FAILURE",
    ipHash: getClientIp(request),
  });

  return NextResponse.json({ success: deleted });
}
