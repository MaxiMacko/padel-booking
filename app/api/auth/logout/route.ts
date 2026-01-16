import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (refreshToken) {
    const resp = await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });
    console.log('LOGOUT response', resp);
  }
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return NextResponse.json({ ok: true });
}
