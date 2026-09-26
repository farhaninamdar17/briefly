/**
 * Text & String Sanitization Utilities
 * Prevents HTML injection, script execution, and excessive whitespace
 */

export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Strip raw tags
    .trim();
}

export function sanitizeSearchQuery(query: unknown): string {
  if (typeof query !== "string") return "";
  return query
    .replace(/[^a-zA-Z0-9\s\-_.?,]/g, "")
    .trim()
    .slice(0, 100);
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
