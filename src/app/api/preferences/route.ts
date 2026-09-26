import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";
import { UserPreferencesSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const preferences = dataStore.getUserPreferences();
    return NextResponse.json({ preferences });
  } catch {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = UserPreferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid preferences payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = dataStore.updateUserPreferences(parsed.data);
    return NextResponse.json({ success: true, preferences: updated });
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
