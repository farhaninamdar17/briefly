import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../lib/security/rateLimiter";

describe("Security: Rate Limiter Engine", () => {
  it("should enforce strict limit on auth tier (5 requests/min)", () => {
    const testIp = `test_auth_ip_${Date.now()}`;

    // First 5 requests must pass
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testIp, "auth");
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(4 - i);
    }

    // 6th request must be rejected
    const blockedRes = checkRateLimit(testIp, "auth");
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.reset).toBeGreaterThan(0);
  });

  it("should separate limits across distinct IP addresses", () => {
    const ip1 = `user_ip_1_${Date.now()}`;
    const ip2 = `user_ip_2_${Date.now()}`;

    // Exhaust ip1
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip1, "auth");
    }
    expect(checkRateLimit(ip1, "auth").success).toBe(false);

    // ip2 should still have fresh limit
    expect(checkRateLimit(ip2, "auth").success).toBe(true);
  });
});
