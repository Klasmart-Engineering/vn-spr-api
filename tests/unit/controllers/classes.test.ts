import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import ClassController from 'src/controllers/v1/class';
import { adminServiceServer } from 'tests/mocks/adminServiceServer';
import { token } from 'tests/mocks/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MockExpressRequest = require('mock-express-request');

// Override environment variables
const envConfig = dotenv.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../.env.test'))
);
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

describe('ClassController', () => {
  beforeAll(() => adminServiceServer.listen());

  afterAll(() => adminServiceServer.close());

  afterEach(() => adminServiceServer.resetHandlers());

  it('should return response', async () => {
    const classController = new ClassController();
    const request = new MockExpressRequest({
      headers: {
        Authorization: token,
      },
    });

    const response = await classController.getPerformanceClasses(
      request,
      '051f6f59-ddf7-4d4a-9b88-d536235bae43',
      true,
      7
    );

    expect(response).toEqual({
      total: 3,
      classes: [
        {
          class_id: '13d94984-0bfa-4d1a-b01c-927f8fa3c86e',
          class_name: 'Class1B Test',
          performance: {
            total_students: 10,
            average_performance: 62.5,
            today_total_classes: 2,
            today_activities: 18,
          },
        },
        {
          class_id: '367ce372-9058-4212-a00e-33d4b9bbf164',
          class_name: 'Class1D',
          performance: {
            total_students: 5,
            average_performance: 0,
            today_total_classes: 1,
            today_activities: 5,
          },
        },
        {
          class_id: '7f78aeac-a8e2-4c4e-b819-458403b68854',
          class_name: 'Class1C',
          performance: {
            total_students: 5,
            average_performance: 0,
            today_total_classes: 1,
            today_activities: 3,
          },
        },
      ],
    });
  });
});
