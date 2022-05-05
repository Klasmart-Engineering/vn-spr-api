import path from 'path';

import { Prisma, PrismaClient } from '@prisma/client';
import { readCsv } from 'src/utils';

export async function performanceLearningOutcomeSeeder(
  prismaClient: PrismaClient
) {
  /* eslint-disable-next-line no-console */
  console.log(`>> reporting_spr_perform_by_lo (~15k records so this will take a while, please be patient)`);

  const learningOutcomes = readCsv(
    path.resolve(__dirname, 'csv/perform_by_lo.csv'),
    {
      cast: (value, context) => {
        switch (context.column) {
          case 'startAt':
          case 'dueAt':
            return parseInt(value);

          default:
            if (value === 'null') {
              return undefined;
            }
            return value;
        }
      },
    }
  ) as Prisma.PerformanceLearningOutcomeACreateInput[] | undefined;

  if (typeof learningOutcomes === 'undefined' || !learningOutcomes) {
    return;
  }

  await prismaClient.performanceLearningOutcomeA.createMany({
    data: learningOutcomes,
    skipDuplicates: true,
  });
  await prismaClient.performanceLearningOutcomeB.createMany({
    data: learningOutcomes as Prisma.PerformanceLearningOutcomeBCreateInput[],
    skipDuplicates: true,
  });
}
