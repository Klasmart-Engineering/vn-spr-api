import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import { AdminService } from 'src/services';
import { adminServiceServer } from 'tests/mocks/adminServiceServer';

// Override environment variables
const envConfig = dotenv.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../.env.test'))
);
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

describe('AdminService', () => {
  // Establish API mocking before all tests.
  beforeAll(() => adminServiceServer.listen());

  // Clean up after the tests are finished.
  afterAll(() => adminServiceServer.close());

  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  afterEach(() => adminServiceServer.resetHandlers());

  describe('#getPermission', () => {
    it('returns permission', async () => {
      const adminService = await AdminService.getInstance('jwt');
      const permission = await adminService.getPermission(
        'academic_profile_20100'
      );

      expect(typeof permission).toEqual('object');
    });
  });
});
