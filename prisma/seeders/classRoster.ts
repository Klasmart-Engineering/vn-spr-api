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
  }) as Prisma.ClassACreateInput[] | undefined;

  if (typeof classes === 'undefined' || !classes) {
    return;
  }

  await prismaClient.classA.createMany({
    data: classes,
    skipDuplicates: true,
  });
  await prismaClient.classB.createMany({
    data: classes as Prisma.ClassBCreateInput[],
    skipDuplicates: true,
  });
}
