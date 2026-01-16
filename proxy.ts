import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PROTECTED_PATHS = ["/dashboard"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;



  // 1️⃣ Якщо access token є — пробуємо його валідувати
  if (accessToken) {
    console.log('access token', jwt.verify(accessToken, process.env.JWT_SECRET!));
    try {
      jwt.verify(accessToken, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch {
      // token expired → пробуємо refresh
    }
  }

  // 2️⃣ Refresh flow
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return redirectToLogin(req);
  }

  const refreshRes = await fetch(
    new URL("/api/auth/refresh", req.url),
    {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
    }
  );

  if (!refreshRes.ok) {
    return redirectToLogin(req);
  }

  // 🔁 refresh OK → пропускаємо
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
