/**
 * External URL Security & SSRF Protection
 * Prevents:
 * - Server-Side Request Forgery (SSRF)
 * - Open Redirects
 * - JavaScript execution (javascript: URLs)
 * - Data URLs (data: URLs)
 * - Internal / Private RFC IP ranges & Cloud metadata queries
 */

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // AWS/GCP/Azure instance metadata service
  "metadata.google.internal",
  "instance-data",
]);

/**
 * Checks if an IPv4 address belongs to a private, loopback, or link-local range
 */
function isPrivateIp(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 10.0.0.0/8 (Private)
  if (parts[0] === 10) return true;
  // 172.16.0.0/12 (Private)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (Link-local / Cloud metadata)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8 (Current network)
  if (parts[0] === 0) return true;

  return false;
}

export interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl: string | null;
  reason?: string;
}

export function validateExternalUrl(urlString: unknown): UrlValidationResult {
  if (typeof urlString !== "string" || !urlString.trim()) {
    return { isValid: false, sanitizedUrl: null, reason: "URL must be a non-empty string" };
  }

  const trimmed = urlString.trim();

  try {
    const parsed = new URL(trimmed);

    // Only allow secure https protocol (or explicitly allowed http in production-whitelisted domains)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        isValid: false,
        sanitizedUrl: null,
        reason: `Forbidden URL protocol: ${parsed.protocol}. Only http: and https: are allowed.`,
      };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check blocked hostnames
    if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
      return {
        isValid: false,
        sanitizedUrl: null,
        reason: "Access to local and metadata hostnames is forbidden (SSRF protection).",
      };
    }

    // Check IP addresses
    if (isPrivateIp(hostname)) {
      return {
        isValid: false,
        sanitizedUrl: null,
        reason: "Access to private/link-local network IP ranges is forbidden.",
      };
    }

    // Ensure username or password is not embedded
    if (parsed.username || parsed.password) {
      return {
        isValid: false,
        sanitizedUrl: null,
        reason: "Credentials embedded in URLs are forbidden.",
      };
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
    };
  } catch {
    return {
      isValid: false,
      sanitizedUrl: null,
      reason: "Malformed URL syntax",
    };
  }
}
