import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/security/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
