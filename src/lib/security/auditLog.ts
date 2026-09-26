/**
 * Security & Administrative Audit Logging
 * Defense-in-depth tracking of critical mutations
 */

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: "STORY" | "ALERT" | "SOURCE" | "VIDEO" | "USER" | "SYSTEM";
  targetId: string;
  timestamp: string;
  result: "SUCCESS" | "FAILURE" | "BLOCKED";
  metadata?: Record<string, unknown>;
  ipHash: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    id: "log_001",
    adminId: "usr_admin_001",
    adminEmail: "admin@briefly.news",
    action: "ALERT_PUBLISH",
    targetType: "ALERT",
    targetId: "alt_pune_monsoon_01",
    timestamp: "2026-09-26T12:00:00.000Z",
    result: "SUCCESS",
    metadata: { authority: "IMD Pune & NDMA", severity: "IMPORTANT" },
    ipHash: "e3b0c44298fc1c149afbf4c8996fb924",
  },
  {
    id: "log_002",
    adminId: "usr_editor_002",
    adminEmail: "editor@briefly.news",
    action: "STORY_CLUSTER_VERIFY",
    targetType: "STORY",
    targetId: "story_metro_01",
    timestamp: "2026-09-26T13:15:00.000Z",
    result: "SUCCESS",
    metadata: { sourcesCount: 3 },
    ipHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  },
  {
    id: "log_003",
    adminId: "usr_admin_001",
    adminEmail: "admin@briefly.news",
    action: "FEED_HEALTH_SYNC",
    targetType: "SOURCE",
    targetId: "src_ndma_cap",
    timestamp: "2026-09-26T14:00:00.000Z",
    result: "SUCCESS",
    metadata: { itemsIngested: 2 },
    ipHash: "e3b0c44298fc1c149afbf4c8996fb924",
  },
];

export function logAuditEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  auditLogs.unshift(newEntry);
  // Keep memory bounded to last 1000 logs
  if (auditLogs.length > 1000) {
    auditLogs.pop();
  }

  return newEntry;
}

export function getAuditLogs(limit: number = 50): AuditLogEntry[] {
  return auditLogs.slice(0, limit);
}
