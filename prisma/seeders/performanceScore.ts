import path from 'path';

import { Prisma, PrismaClient } from '@prisma/client';
import { readCsv } from 'src/utils';

export async function performanceScoreSeeder(prismaClient: PrismaClient) {
  /* eslint-disable-next-line no-console */
  console.log(`>> reporting_spr_perform_by_score`);

  const score = readCsv(path.resolve(__dirname, 'csv/perform_by_score.csv'), {
    cast: (value, context) => {
      switch (context.column) {
        case 'achievedScore':
        case 'totalScore':
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
  }) as Prisma.PerformanceScoreCreateInput[] | undefined;

  if (typeof score === 'undefined' || !score) {
    return;
  }

  await prismaClient.performanceScore.createMany({
    data: score,
    skipDuplicates: true,
  });
}
