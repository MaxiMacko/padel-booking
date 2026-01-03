import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";

const ACCESS_TTL = "15m";
const REFRESH_TTL_DAYS = 7;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // 🔐 Access token
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TTL }
  );

  // 🔁 Refresh token
  const refreshToken = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);

  await prisma.session.create({
    data: {
      id: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  const res = NextResponse.json({ ok: true });

  // 🍪 cookies
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 15,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * REFRESH_TTL_DAYS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
