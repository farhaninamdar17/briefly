import { NextResponse } from "next/server";
import { getAuthenticatedUser, hasRequiredRole } from "@/lib/security/auth";
import { getAuditLogs } from "@/lib/security/auditLog";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user || !hasRequiredRole(user, "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized: Admin authorization required to view audit logs." }, { status: 403 });
  }

  const logs = getAuditLogs(50);
  return NextResponse.json({ logs });
}
