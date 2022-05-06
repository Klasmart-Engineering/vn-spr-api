import { PrismaClient } from '@prisma/client';
import { PerformanceScore } from 'src/models/performance';
<<<<<<< HEAD
import { Days, GroupType, ReportEntity, UUID } from 'src/types';
=======
import { ReportEntity, UUID } from 'src/types';
>>>>>>> 23984ad (feat: student overall performance)
import { getVerInUse } from 'src/utils/database';
import { dateDiff, plusDate, subtractDate } from 'src/utils/date';
import { toFixedNumber } from 'src/utils/number';
import { isAbove, isBelow, isMeets } from 'src/utils/performanceGroup';

import {
  getStudentsPerformLO,
  PerformanceLORecord,
} from './performanceLearningOutcome';

export interface PerformanceScoreRecord {
  studentId: UUID;
  sps: number;
  day: string;
}

const prisma = new PrismaClient();

export const getScores = async (
  classId: UUID,
  timezone: number,
  days: Days,
  viewLOs: boolean,
  group: GroupType,
  studentId: UUID
) => {
  let groupLO = group;

  const studentsScore = await getStudentScores(
    classId,
    timezone,
    days,
    studentId
  );

  let studentsPerformanceLO: Array<PerformanceLORecord> = [];
  if (viewLOs) {
    studentsPerformanceLO = await getStudentsPerformLO(
      classId,
      timezone,
      days,
      studentId
    );
  }

  if (studentId) {
    const averageSPSOfStudent =
      (studentsScore
        .map((student) => student.sps)
        .reduce((sps1, sps2) => sps1 + sps2, 0) /
        studentsScore.length) |
      0;
    group = isAbove(averageSPSOfStudent)
      ? 'above'
      : isMeets(averageSPSOfStudent)
      ? 'meets'
      : 'below';
    if (viewLOs) {
      const averageSPLOfStudent =
        (studentsPerformanceLO
          .map((student) => student.spl)
          .reduce((spl1, spl2) => spl1 + spl2, 0) /
          studentsPerformanceLO.length) |
        0;
      groupLO = isAbove(averageSPLOfStudent)
        ? 'above'
        : isMeets(averageSPLOfStudent)
        ? 'meets'
        : 'below';
    }
  }

  const performanceScores: Array<PerformanceScore> = [];
  const timezoneInSeconds = timezone * 60 * 60;
  const toDate = new Date(Date.now() + timezoneInSeconds * 1000);
  const fromDate = subtractDate(toDate, days);

  for (let i = 0; i <= dateDiff(fromDate, toDate); i++) {
    const date = new Date(plusDate(fromDate, i).getTime());
    const day = date.toISOString().split('T')[0];

    performanceScores.push({
      name: day,
      ...(group === 'all' || group === 'above'
        ? {
            above: averageSPSOfGroupByDay(studentsScore, day, isAbove),
          }
        : {}),
      ...(group === 'all' || group === 'meets'
        ? {
            meets: averageSPSOfGroupByDay(studentsScore, day, isMeets),
          }
        : {}),
      ...(group === 'all' || group === 'below'
        ? {
            below: averageSPSOfGroupByDay(studentsScore, day, isBelow),
          }
        : {}),
      ...(viewLOs
        ? {
<<<<<<< HEAD
            learningOutcome: {
=======
            score: {
>>>>>>> 23984ad (feat: student overall performance)
              ...(groupLO === 'all' || groupLO === 'above'
                ? {
                    above: averageSPLOfGroupByDay(
                      studentsPerformanceLO,
                      day,
                      isAbove
                    ),
                  }
                : {}),
              ...(groupLO === 'all' || groupLO === 'meets'
                ? {
                    meets: averageSPLOfGroupByDay(
                      studentsPerformanceLO,
                      day,
                      isMeets
                    ),
                  }
                : {}),
              ...(groupLO === 'all' || groupLO === 'below'
                ? {
                    below: averageSPLOfGroupByDay(
                      studentsPerformanceLO,
                      day,
                      isBelow
                    ),
                  }
                : {}),
            },
          }
        : {}),
    });
  }

  return performanceScores;
};

export const getStudentScores = async (
  classId: UUID,
  timezone: number,
  days: number,
  studentId?: UUID
): Promise<Array<{ studentId: UUID; sps: number; day: string }>> => {
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  let tableName = 'reporting_spr_perform_by_score_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_score_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const daysAgoTimestampSQL = `(${nowTimestampSQL} - (${days} * 3600 * 24))`;

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
  ${studentId ? `AND student_id = '${studentId}'` : ``}
  GROUP BY studentId, day
  HAVING
    day >= DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') AND
    day <= DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d')
  ORDER BY day DESC;
  `;

  const studentsScore = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(studentsScore))
    throw new Error('Failed to get students score');
  return studentsScore;
};

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

const averageSPLOfGroupByDay = (
  studentsPerformanceLO: Array<PerformanceLORecord>,
  day: string,
  groupCondition: (spl: number) => boolean
) => {
  const group = studentsPerformanceLO.filter(
    (student) => student.day === day && groupCondition(student.spl)
  );

  if (group.length === 0) return 0;

  const sumSPL = group
    .map((student) => student.spl)
    .reduce((spl1, spl2) => spl1 + spl2, 0);

  return toFixedNumber(sumSPL / group.length, 2);
};

const averageSPSOfGroupByDay = (
  studentsScore: Array<PerformanceScoreRecord>,
  day: string,
  groupCondition: (sps: number) => boolean
) => {
  const group = studentsScore.filter(
    (student) => student.day === day && groupCondition(student.sps)
  );

  if (group.length === 0) return 0;

  const sumSPS = group
    .map((student) => student.sps)
    .reduce((sps1, sps2) => sps1 + sps2, 0);

  return toFixedNumber(sumSPS / group.length, 2);
};
