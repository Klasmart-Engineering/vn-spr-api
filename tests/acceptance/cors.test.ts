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
  it('has Access-Control-Allow-Origin', async () => {
    const res = await requestWithSupertest
      .get('/v1/classes')
      .set('Origin', 'http://alpha.kidsloop.net');

    console.log(res.headers);
    expect(res.headers['access-control-allow-origin']).toBe(
      'http://alpha.kidsloop.net'
    );
  });

  it('does not have Access-Control-Allow-Origin', async () => {
    const res = await requestWithSupertest
      .get('/v1/classes')
      .set('Origin', 'http://not-allow-origin.com');

    console.log(res.headers);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
