import { cookies } from "next/headers";

export type UserRole = "USER" | "EDITOR" | "ADMIN";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

// In-memory demo users with predefined roles
export const SEED_USERS: AuthenticatedUser[] = [
  {
    id: "usr_admin_001",
    email: "admin@briefly.news",
    name: "Editorial Lead",
    role: "ADMIN",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr_editor_002",
    email: "editor@briefly.news",
    name: "Senior Editor",
    role: "EDITOR",
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "usr_user_003",
    email: "reader@briefly.news",
    name: "Arjun Sharma",
    role: "USER",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

const SESSION_COOKIE_NAME = "briefly_session_token";

/**
 * Server-side session verification
 * Extracts and validates current session user
 */
export async function getAuthenticatedUser(req?: Request): Promise<AuthenticatedUser | null> {
  let token: string | undefined;

  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Not in a server action / route handler context
    }
  }

  if (!token) {
    return null;
  }

  // Token format: "user_id:role:signature" or simple session ID
  try {
    const [userId] = token.split(":");
    const matched = SEED_USERS.find((u) => u.id === userId || u.email === userId);
    return matched || null;
  } catch {
    return null;
  }
}

/**
 * Verifies if user has required minimum role
 */
export function hasRequiredRole(user: AuthenticatedUser | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true; // ADMIN has access to all
  if (user.role === "EDITOR" && (requiredRole === "EDITOR" || requiredRole === "USER")) return true;
  return user.role === requiredRole;
}

export function createSessionToken(user: AuthenticatedUser): string {
  // In a full environment this uses HMAC-SHA256
  return `${user.id}:${user.role}:${Date.now()}`;
}

export { SESSION_COOKIE_NAME };
