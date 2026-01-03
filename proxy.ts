import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let payload: { id: string; role: "CLIENT" | "TRAINER" | "ADMIN" };

  try {
    payload = jwt.verify(token, JWT_SECRET) as typeof payload;
  } catch (err) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Авторизація по ролі
  if (url.pathname.startsWith("/dashboard/client") && payload.role !== "CLIENT") {
    url.pathname = "/dashboard/trainer/calendar";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/dashboard/trainer") && payload.role !== "TRAINER") {
    url.pathname = "/dashboard/client/calendar";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/client/:path*",
    "/dashboard/trainer/:path*",
  ],
};
