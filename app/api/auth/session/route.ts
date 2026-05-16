import { NextRequest, NextResponse } from "next/server";

import { getAuthCookieName, getClientIp, verifyJwt } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getAuthCookieName())?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const payload = verifyJwt(token);
  const clientIp = getClientIp(request.headers);

  const requiresSameIp = payload?.credentialType !== "main";

  if (!payload || (requiresSameIp && payload.ip !== clientIp)) {
    const response = NextResponse.json(
      { authenticated: false },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
    response.cookies.set({
      name: getAuthCookieName(),
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.json(
    {
      authenticated: true,
      expiresAt: payload.exp,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
