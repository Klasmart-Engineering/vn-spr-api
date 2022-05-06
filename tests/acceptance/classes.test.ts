import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import app from 'src/app';
import supertest from 'supertest';

// Override environment variables
const envConfig = dotenv.parse(
  fs.readFileSync(path.resolve(__dirname, '../../.env.test'))
);

for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const requestWithSupertest = supertest(app);

describe('GET /v1/classes', () => {
  xit('returns 200', async () => {
    const res = await requestWithSupertest
      .get('/v1/classes')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzc3VlciI6ImNhbG1pZC1kZWJ1ZyJ9.eyJpZCI6IjgxZDhlMWMxLWM3ZTEtNTdjZC05OGY1LTQ1NDlhOGUwYzAyNiIsImVtYWlsIjoicWErc3RyZXNzX3QxQGNhbG1pZC5jb20iLCJleHAiOjE5NDUyMDg5OTgsImlzcyI6ImNhbG1pZC1kZWJ1ZyIsImlhdCI6MTY0NTcxNjE3NH0.GuWdYRd2m79YLZZSb0vncpkLQwxGBP7ZFpGndh5k_Zo'
      );

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(res.body.classes)).toBe(true);
  });

  it('returns 401 when no token', async () => {
    const res = await requestWithSupertest
      .get('/v1/classes');
    expect(res.status).toBe(401);
  });

  it('returns 401 when wrong token', async () => {
    const res = await requestWithSupertest
      .get('/v1/classes')
      .set(
        'Authorization',
        'wrong token'
      );

    expect(res.status).toBe(401);
  });

});
