// test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('http://backend/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })
    );
  }),
];
