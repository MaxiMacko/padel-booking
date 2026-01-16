import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    `${process.env.BACKEND_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      await res.json(),
      { status: res.status },
    );
  }

  const data = await res.json();

  const response = NextResponse.json(data);

  response.cookies.set('access_token', data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15
  });

  response.cookies.set('refresh_token', data.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}

