it('refreshes token using cookie', async () => {
  const req = new NextRequest('http://localhost/api/auth/refresh', {
    headers: {
      cookie: 'refresh_token=old-token',
    },
  });

  const res = await POST(req);

  expect(res.status).toBe(200);
});
