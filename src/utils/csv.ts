import fs from 'fs';

import { Prisma } from '@prisma/client';
import { Options } from 'csv-parse';
import { parse } from 'csv-parse/sync';

export function readCsv(
  filePath: string,
  options?: Options
):
  | Prisma.ClassACreateInput[]
  | Prisma.ClassBCreateInput[]
  | Prisma.ScheduleACreateInput[]
  | Prisma.ScheduleBCreateInput[]
  | Prisma.PerformanceScoreACreateInput[]
  | Prisma.PerformanceScoreBCreateInput[]
  | Prisma.PerformanceLearningOutcomeACreateInput[]
  | Prisma.PerformanceLearningOutcomeBCreateInput[]
  | undefined {
  if (!fs.existsSync(filePath)) {
    /* eslint-disable-next-line no-console */
    console.log(`CSV ${filePath} doesn't exist!`);
    return undefined;
  }

  let config = {
    delimiter: ',',
    columns: true,
    skip_empty_lines: true,
  };
  if (options) {
    config = { ...options, ...config };
  }

  return parse(fs.readFileSync(filePath, 'utf8'), config);
}
