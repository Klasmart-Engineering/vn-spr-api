import { PrismaClient } from '@prisma/client';

import { classRosterSeeder } from './classRoster';
import { performanceLearningOutcomeSeeder } from './performanceLearningOutcome';
import { performanceScoreSeeder } from './performanceScore';
import { scheduleSeeder } from './schedule';
import { switchTableSeeder } from './switchTable';

const prisma = new PrismaClient();

async function main() {
  /* eslint-disable-next-line no-console */
  console.log(`Start seeding...`);

  await switchTableSeeder(prisma);
  await classRosterSeeder(prisma);
  await scheduleSeeder(prisma);
  await performanceScoreSeeder(prisma);
  await performanceLearningOutcomeSeeder(prisma);

  /* eslint-disable-next-line no-console */
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    /* eslint-disable-next-line no-console */
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
