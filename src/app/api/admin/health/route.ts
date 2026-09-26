import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasRequiredRole } from "@/lib/security/auth";
import { dataStore } from "@/lib/db/store";
import { providerRegistry } from "@/lib/news/providers";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const sourcesHealth = await providerRegistry.getHealthReport();
  const allStories = dataStore.getStories();
  const allAlerts = dataStore.getAlerts(false);
  const allVideos = dataStore.getVideos();

  const importantCount = allStories.filter((s) => s.importance !== "NORMAL").length;
  const activeAlertsCount = allAlerts.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date()).length;

  return NextResponse.json({
    status: "OPERATIONAL",
    timestamp: new Date().toISOString(),
    metrics: {
      totalStories: allStories.length,
      importantStories: importantCount,
      totalVideos: allVideos.length,
      activeAlerts: activeAlertsCount,
      totalAlerts: allAlerts.length,
    },
    sources: sourcesHealth,
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      securityMode: "DEFENSE_IN_DEPTH",
      cspEnforced: true,
      rateLimiterActive: true,
    },
  });
}
