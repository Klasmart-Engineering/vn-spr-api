import { PrismaClient } from '@prisma/client';
import { ReportEntity, UUID } from 'src/types';
import { getVerInUse } from 'src/utils/database';

const prisma = new PrismaClient();

export const getStudentsScoreOfDay = async ({
  orgId,
  selectedDay,
  timezoneInSeconds,
}: {
  orgId: UUID;
  selectedDay: string;
  timezoneInSeconds: number;
}): Promise<
  Array<{ classId: UUID; studentId: UUID; sps: number; day: string }>
> => {
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  let tableName = 'reporting_spr_perform_by_score_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_score_B';
  }
  const sql = `
    SELECT
      class_id AS classId,
      student_id AS studentId,
      (SUM(achieved_score) * 100 / SUM(total_score)) AS sps,
      CASE WHEN start_at = 0 THEN
        DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
      ELSE
        DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d')
      END AS day
    FROM
      ${tableName}
    WHERE
      org_id = '${orgId}'
    GROUP BY classId, studentId, day
    HAVING
      day = DATE_FORMAT('${selectedDay}', '%Y-%m-%d')
    ORDER BY day DESC;
    `;

  const studentsScore = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(studentsScore))
    throw new Error('Failed to get students score');
  return studentsScore;
};
