import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";
import { SEED_USERS, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/security/auth";
import { logAuditEvent } from "@/lib/security/auditLog";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = checkRateLimit(ip, "auth");

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again after 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Check seed accounts
    const user = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // For demo purposes, any valid password for matching user logs in
    if (!user || password.length < 6) {
      logAuditEvent({
        adminId: "anonymous",
        adminEmail: email,
        action: "AUTH_LOGIN_FAIL",
        targetType: "USER",
        targetId: email,
        result: "FAILURE",
        ipHash: ip,
      });

      return NextResponse.json(
        { error: "Invalid credentials. Please check your email and password." },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);

    logAuditEvent({
      adminId: user.id,
      adminEmail: user.email,
      action: "AUTH_LOGIN_SUCCESS",
      targetType: "USER",
      targetId: user.id,
      result: "SUCCESS",
      ipHash: ip,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication service error." }, { status: 500 });
  }
}
