import { PrismaClient } from '@prisma/client';
import { Category } from 'src/models';
import { ReportEntity } from 'src/types';
import { getVerInUse } from 'src/utils/database';

const prisma = new PrismaClient();

export const getCategories = async (
  classId: string,
  timezone: number,
  days: number // 7, 30, 365
): Promise<Category[]> => {
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  let tableName = 'reporting_spr_perform_by_lo_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_lo_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const daysAgoTimestampSQL = `(${nowTimestampSQL} - (${days} * 3600 * 24))`;

  const dateCaseWhenSQL = `
  CASE WHEN start_at = 0 THEN
    DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
  ELSE
    DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d')
  END`;

  return await prisma.$queryRawUnsafe(
    `
    SELECT DISTINCT
      category AS id,
      category_name AS name
    FROM
      ${tableName}
    WHERE
      class_id = '${classId}'
      AND status != 'NotCovered'
      AND category_name != ''
      AND DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') < ${dateCaseWhenSQL}
      AND DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d') >= ${dateCaseWhenSQL};
    `
  );
};
