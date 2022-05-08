import { PrismaClient } from '@prisma/client';
import { UUID } from 'src/types';

const tableName = 'reporting_spr_perform_by_score_A';
export default class PerformanceScoreRepository {
  prisma = new PrismaClient();

  public async getStudentsScoreOfDay({
    orgId,
    selectedDay,
    timezoneInSeconds,
  }: {
    orgId: UUID;
    selectedDay: string;
    timezoneInSeconds: number;
  }): Promise<
    Array<{ classId: UUID; studentId: UUID; sps: number; day: string }>
  > {
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

    const studentsScore = await this.prisma.$queryRawUnsafe(`${sql}`);
    if (!Array.isArray(studentsScore))
      throw new Error('Failed to get students score');
    return studentsScore;
  }

  public async getStudentScoresOfClassInPeriod({
    classId,
    fromDay,
    toDay,
    timezoneInSeconds,
  }: {
    classId: UUID;
    fromDay: string;
    toDay: string;
    timezoneInSeconds: number;
  }): Promise<Array<{ studentId: UUID; sps: number; day: string }>> {
    const sql = `
    SELECT
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
      class_id = '${classId}'
    GROUP BY studentId, day
    HAVING
      day >= DATE_FORMAT('${fromDay}', '%Y-%m-%d') AND
      day <= DATE_FORMAT('${toDay}', '%Y-%m-%d')
    ORDER BY day DESC;
    `;

    const studentsScore = await this.prisma.$queryRawUnsafe(`${sql}`);
    if (!Array.isArray(studentsScore))
      throw new Error('Failed to get students score');
    return studentsScore;
  }
}
