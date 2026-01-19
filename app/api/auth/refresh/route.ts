// app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    cookieStore.delete('refresh_token');
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
  }

  const { accessToken, refreshToken: newRefreshToken } = await res.json();

  cookieStore.set('refresh_token', newRefreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return NextResponse.json({ accessToken });
}
