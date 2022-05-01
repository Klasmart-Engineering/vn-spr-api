import path from 'path';

import { Prisma, PrismaClient } from '@prisma/client';
import { readCsv } from 'src/utils';

export async function scheduleSeeder(prismaClient: PrismaClient) {
  /* eslint-disable-next-line no-console */
  console.log(`>> reporting_spr_scheduled_classes`);

  const schedules = readCsv(
    path.resolve(__dirname, 'csv/scheduled_classes.csv'),
    {
      cast: (value, context) => {
        switch (context.column) {
          case 'startAt':
          case 'dueAt':
          case 'totalActivities':
            return parseInt(value);

          default:
            if (value === 'null') {
              return undefined;
            }
            return value;
        }
      },
    }
  ) as Prisma.ScheduleCreateInput[] | undefined;

  if (typeof schedules === 'undefined' || !schedules) {
    return;
  }

  await prismaClient.schedule.createMany({
    data: schedules,
    skipDuplicates: true,
  });
}
