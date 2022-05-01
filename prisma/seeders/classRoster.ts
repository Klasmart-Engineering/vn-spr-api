import path from 'path';

import { Prisma, PrismaClient } from '@prisma/client';
import { readCsv } from 'src/utils';

export async function classRosterSeeder(prismaClient: PrismaClient) {
  /* eslint-disable-next-line no-console */
  console.log(`>> reporting_spr_class_roster`);

  const classes = readCsv(path.resolve(__dirname, 'csv/class_roster.csv'), {
    cast: (value, context) => {
      switch (context.column) {
        case 'totalStudents':
        case 'scheduledClasses':
          return parseInt(value);

        default:
          if (value === 'null') {
            return undefined;
          }
          return value;
      }
    },
  }) as Prisma.ClassCreateInput | undefined;

  if (typeof classes === 'undefined' || !classes) {
    return;
  }

  await prismaClient.class.createMany({
    data: classes,
    skipDuplicates: true,
  });
}
