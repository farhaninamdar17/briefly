import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasRequiredRole } from "@/lib/security/auth";
import { dataStore } from "@/lib/db/store";
import { AlertCreateSchema } from "@/lib/validation/schemas";
import { logAuditEvent } from "@/lib/security/auditLog";
import { getClientIp } from "@/lib/security/rateLimiter";
import { OfficialAlertDTO } from "@/lib/dal/dto";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized: Admin authorization required to issue official alerts." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = AlertCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const alertData = parsed.data;
    const newAlert: OfficialAlertDTO = {
      id: `alt_${Date.now()}`,
      authority: alertData.authority,
      event: alertData.event,
      severity: alertData.severity,
      area: alertData.area,
      instructions: alertData.instructions,
      originalUrl: alertData.originalUrl,
      timestamp: new Date().toISOString(),
      expiresAt: alertData.expiresAt,
      verified: true,
      sourceType: "GOV_CIVIL",
    };

    dataStore.addAlert(newAlert);

    logAuditEvent({
      adminId: user.id,
      adminEmail: user.email,
      action: "ALERT_DISPATCH",
      targetType: "ALERT",
      targetId: newAlert.id,
      result: "SUCCESS",
      metadata: { authority: newAlert.authority, severity: newAlert.severity },
      ipHash: getClientIp(request),
    });

    return NextResponse.json({ success: true, alert: newAlert }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to dispatch official alert." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized: Admin authorization required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const alertId = searchParams.get("id");

  if (!alertId) {
    return NextResponse.json({ error: "Alert ID required" }, { status: 400 });
  }

  const deleted = dataStore.deleteAlert(alertId);

  logAuditEvent({
    adminId: user.id,
    adminEmail: user.email,
    action: "ALERT_DELETE",
    targetType: "ALERT",
    targetId: alertId,
    result: deleted ? "SUCCESS" : "FAILURE",
    ipHash: getClientIp(request),
  });

  return NextResponse.json({ success: deleted });
}
