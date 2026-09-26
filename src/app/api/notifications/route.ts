import { NextResponse } from "next/server";
import { dataStore } from "@/lib/db/store";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(ip, "notifications");

  if (!rateCheck.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const alerts = dataStore.getAlerts(true);
  const prefs = dataStore.getUserPreferences();

  // Create notifications derived strictly from active alerts & top urgent stories
  const notifications = alerts.map((a) => ({
    id: `notif_${a.id}`,
    title: `🚨 ${a.severity} Alert for ${a.area.split(" ")[0]}`,
    body: `${a.event}. ${a.instructions.slice(0, 100)}...`,
    severity: a.severity,
    timestamp: a.timestamp,
    source: a.authority,
    url: a.originalUrl,
  }));

  return NextResponse.json({
    notifications,
    quietHoursActive: prefs.quietHoursEnabled,
    pushEnabled: prefs.pushEnabled,
  });
}
