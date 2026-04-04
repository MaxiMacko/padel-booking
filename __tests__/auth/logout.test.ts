import { POST } from "@/app/api/auth/logout/route";
import { NextRequest } from "next/server";
import { expect } from "vitest";

it('clears refresh_token cookie', async () => {
  const req = new NextRequest('http://localhost/api/auth/logout', {
    headers: {
      cookie: 'refresh_token=token',
    },
  });

  const res = await POST(req);

  const cookies = res.headers.get('set-cookie');
  expect(cookies).toContain('refresh_token=;');
});
