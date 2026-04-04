import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import { expect, it } from 'vitest';

it('sets refresh_token cookie on login', async () => {
  const req = new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@test.com',
      password: '123',
    }),
  });

  const res = await POST(req);

  const cookies = res.headers.get('set-cookie');
  expect(cookies).toContain('refresh_token=');
});
