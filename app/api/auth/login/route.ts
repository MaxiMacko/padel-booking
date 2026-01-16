import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.BACKEND_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      await res.json(),
      { status: res.status },
    );
  }

  const data = await res.json();

  const { accessToken, refreshToken } = data;

  const response = NextResponse.json(data);

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 15,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
