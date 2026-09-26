import { describe, it, expect } from "vitest";
import { validateExternalUrl } from "../lib/security/urlValidator";

describe("Security: SSRF & External URL Validator", () => {
  it("should allow valid public HTTPS news URLs", () => {
    const valid = validateExternalUrl("https://www.thehindu.com/news/national/");
    expect(valid.isValid).toBe(true);
    expect(valid.sanitizedUrl).toBe("https://www.thehindu.com/news/national/");
  });

  it("should reject localhost and loopback targets", () => {
    const res1 = validateExternalUrl("http://localhost:3000/admin");
    expect(res1.isValid).toBe(false);
    expect(res1.reason).toContain("forbidden");

    const res2 = validateExternalUrl("http://127.0.0.1:8080/secret");
    expect(res2.isValid).toBe(false);
  });

  it("should reject AWS/Cloud metadata service IP (169.254.169.254)", () => {
    const res = validateExternalUrl("http://169.254.169.254/latest/meta-data/");
    expect(res.isValid).toBe(false);
  });

  it("should reject private RFC 1918 subnets", () => {
    expect(validateExternalUrl("http://10.0.0.1/internal").isValid).toBe(false);
    expect(validateExternalUrl("http://192.168.1.1/router").isValid).toBe(false);
    expect(validateExternalUrl("http://172.16.5.1/db").isValid).toBe(false);
  });

  it("should reject dangerous non-http protocols (javascript:, data:)", () => {
    expect(validateExternalUrl("javascript:alert(1)").isValid).toBe(false);
    expect(validateExternalUrl("data:text/html,<script>alert(1)</script>").isValid).toBe(false);
    expect(validateExternalUrl("file:///etc/passwd").isValid).toBe(false);
  });
});
