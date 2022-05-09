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

  describe('#getUsersByIds', () => {
    it('returns users', async () => {
      const adminService = await AdminService.getInstance('jwt');
      const users = await adminService.getUsersByIds([
        '10f60763-c32b-4d48-9777-a0c1d28f6e85',
        '5abd2d6e-fa9f-4026-a9c1-b6b47e557019',
      ]);

      expect(users).toEqual([
        {
          id: '10f60763-c32b-4d48-9777-a0c1d28f6e85',
          givenName: 'John',
          familyName: 'Doe',
          avatar: null,
        },
        {
          id: '5abd2d6e-fa9f-4026-a9c1-b6b47e557019',
          givenName: 'Jane',
          familyName: 'Doe',
          avatar: null,
        },
      ]);
    });
  });
});
