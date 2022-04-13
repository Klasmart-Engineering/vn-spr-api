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

describe('GET /ping', () => {
  beforeEach(async () => {
    // something here
  });

  it('returns 200', async () => {
    const res = await requestWithSupertest.get('/ping');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});
