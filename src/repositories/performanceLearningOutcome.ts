import { PrismaClient } from '@prisma/client';
import { ReportEntity, UUID } from 'src/types';
import { getVerInUse } from 'src/utils/database';

export interface PerformanceLORecord {
  studentId: UUID;
  spl: number;
  day: string;
}

const prisma = new PrismaClient();

export const getSPLsByStudentIds = async (
  classId: UUID,
  timezone: number,
  days: number,
  studentIds: UUID[]
): Promise<Array<PerformanceLORecord>> => {
  if (studentIds.length === 0) return [];

  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_LEARNING_OUTCOME);
  let tableName = 'reporting_spr_perform_by_lo_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_lo_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const daysAgoTimestampSQL = `(${nowTimestampSQL} - (${days} * 3600 * 24))`;

  const sql = `
    SELECT
      student_id AS studentId,
      (COUNT(CASE WHEN status = 'Achieved' THEN 1 ELSE NULL END) * 100 / COUNT(learning_outcome)) AS spl,
      CASE WHEN start_at = 0 THEN
        DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
      ELSE
        DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d')
      END AS day
    FROM
      ${tableName}
    WHERE
      class_id = '${classId}'
    AND student_id IN (${studentIds.map((item) => `'${item}'`).join(',')})
    GROUP BY studentId, day
    HAVING
      day >= DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') AND
      day <= DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d')
    ORDER BY day DESC;
    `;

  const studentsPerformLO = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(studentsPerformLO))
    throw new Error('Failed to get students performance LO');
  return studentsPerformLO;
};
