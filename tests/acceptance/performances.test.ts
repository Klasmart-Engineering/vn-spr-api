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

describe('Performances', () => {
  describe('GET /v1/performances', () => {
    it('returns 200 when no timeZoneOffset param', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances')
        .set(
          'Authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzc3VlciI6ImNhbG1pZC1kZWJ1ZyJ9.eyJpZCI6IjgxZDhlMWMxLWM3ZTEtNTdjZC05OGY1LTQ1NDlhOGUwYzAyNiIsImVtYWlsIjoicWErc3RyZXNzX3QxQGNhbG1pZC5jb20iLCJleHAiOjE5NDUyMDg5OTgsImlzcyI6ImNhbG1pZC1kZWJ1ZyIsImlhdCI6MTY0NTcxNjE3NH0.GuWdYRd2m79YLZZSb0vncpkLQwxGBP7ZFpGndh5k_Zo'
        );

      expect(res.status).toBe(200);
      expect(typeof res.body).toEqual('object');
    });

    it('returns 200 with timeZoneOffset param', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances')
        .query({
          timeZoneOffset: 7200,
        })
        .set(
          'Authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzc3VlciI6ImNhbG1pZC1kZWJ1ZyJ9.eyJpZCI6IjgxZDhlMWMxLWM3ZTEtNTdjZC05OGY1LTQ1NDlhOGUwYzAyNiIsImVtYWlsIjoicWErc3RyZXNzX3QxQGNhbG1pZC5jb20iLCJleHAiOjE5NDUyMDg5OTgsImlzcyI6ImNhbG1pZC1kZWJ1ZyIsImlhdCI6MTY0NTcxNjE3NH0.GuWdYRd2m79YLZZSb0vncpkLQwxGBP7ZFpGndh5k_Zo'
        );

      expect(res.status).toBe(200);
      expect(typeof res.body).toEqual('object');
    });

    it('returns 400 with timeZoneOffset param is NaN', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances')
        .query({
          timeZoneOffset: 'not a number',
        })
        .set(
          'Authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzc3VlciI6ImNhbG1pZC1kZWJ1ZyJ9.eyJpZCI6IjgxZDhlMWMxLWM3ZTEtNTdjZC05OGY1LTQ1NDlhOGUwYzAyNiIsImVtYWlsIjoicWErc3RyZXNzX3QxQGNhbG1pZC5jb20iLCJleHAiOjE5NDUyMDg5OTgsImlzcyI6ImNhbG1pZC1kZWJ1ZyIsImlhdCI6MTY0NTcxNjE3NH0.GuWdYRd2m79YLZZSb0vncpkLQwxGBP7ZFpGndh5k_Zo'
        );
      expect(res.status).toBe(400);
      expect(res.text).toEqual(
        'error 400: timeZoneOffset param is not a number'
      );
    });

    it('returns 401 when no token', async () => {
      const res = await requestWithSupertest.get(
        '/v1/permissions/academic_profile_20100'
      );
      expect(res.status).toBe(401);
    });

    it('returns 401 when wrong token', async () => {
      const res = await requestWithSupertest
        .get('/v1/permissions/academic_profile_20100')
        .set('Authorization', 'wrong token');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /v1/performances/groups', () => {
    it('returns 200', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances/groups')
        .set(
          'Authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzc3VlciI6ImNhbG1pZC1kZWJ1ZyJ9.eyJpZCI6IjgxZDhlMWMxLWM3ZTEtNTdjZC05OGY1LTQ1NDlhOGUwYzAyNiIsImVtYWlsIjoicWErc3RyZXNzX3QxQGNhbG1pZC5jb20iLCJleHAiOjE5NDUyMDg5OTgsImlzcyI6ImNhbG1pZC1kZWJ1ZyIsImlhdCI6MTY0NTcxNjE3NH0.GuWdYRd2m79YLZZSb0vncpkLQwxGBP7ZFpGndh5k_Zo'
        );

      expect(res.status).toBe(200);
      expect(typeof res.body).toEqual('object');
    });

    it('returns 401 when no token', async () => {
      const res = await requestWithSupertest.get('/v1/performances/skills');
      expect(res.status).toBe(401);
    });

    it('returns 401 when wrong token', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances/skills')
        .set('Authorization', 'wrong token');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /v1/performances/skills', () => {
    it('returns 200', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances/skills')
        .set(
          'Authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImlzc3VlciI6ImNhbG1pZC1kZWJ1ZyJ9.eyJpZCI6IjgxZDhlMWMxLWM3ZTEtNTdjZC05OGY1LTQ1NDlhOGUwYzAyNiIsImVtYWlsIjoicWErc3RyZXNzX3QxQGNhbG1pZC5jb20iLCJleHAiOjE5NDUyMDg5OTgsImlzcyI6ImNhbG1pZC1kZWJ1ZyIsImlhdCI6MTY0NTcxNjE3NH0.GuWdYRd2m79YLZZSb0vncpkLQwxGBP7ZFpGndh5k_Zo'
        );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 401 when no token', async () => {
      const res = await requestWithSupertest.get('/v1/performances/skills');
      expect(res.status).toBe(401);
    });

    it('returns 401 when wrong token', async () => {
      const res = await requestWithSupertest
        .get('/v1/performances/skills')
        .set('Authorization', 'wrong token');

      expect(res.status).toBe(401);
    });
  });
});
