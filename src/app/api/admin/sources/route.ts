import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasRequiredRole } from "@/lib/security/auth";
import { providerRegistry } from "@/lib/news/providers";
import { runNewsProcessingPipeline } from "@/lib/news/pipeline";
import { logAuditEvent } from "@/lib/security/auditLog";
import { getClientIp } from "@/lib/security/rateLimiter";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized: Editor or Admin required" }, { status: 403 });
  }

  const health = await providerRegistry.getHealthReport();
  return NextResponse.json({ sources: health });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized: Admin authorization required to trigger sync" }, { status: 403 });
  }

  try {
    const report = await runNewsProcessingPipeline();

    logAuditEvent({
      adminId: user.id,
      adminEmail: user.email,
      action: "MANUAL_PIPELINE_TRIGGER",
      targetType: "SYSTEM",
      targetId: "news_pipeline",
      result: "SUCCESS",
      metadata: { report },
      ipHash: getClientIp(request),
    });

    return NextResponse.json({ success: true, report });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Pipeline execution error", details: errorMessage }, { status: 500 });
  }
}
