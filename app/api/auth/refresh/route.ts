import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const session = await prisma.session.findUnique({
    where: { id: refreshToken },
    include: { user: true },
  });

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt < new Date()
  ) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const accessToken = jwt.sign(
    { sub: session.user.id, role: session.user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const res = NextResponse.json({ ok: true });

  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 15,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
