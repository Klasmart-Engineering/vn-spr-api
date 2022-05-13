import { PrismaClient } from '@prisma/client';
import { GROUP_BELOW_THRESHOLD, GROUP_UPPER_THRESHOLD } from 'src/config';
import { PerformanceScore } from 'src/models/performance';
import { Days, GroupType, ReportEntity, UUID } from 'src/types';
import { getVerInUse } from 'src/utils/database';
import {
  generateDates,
  generateDatesForYear,
  groupScoresByDateRanges,
  groupScoresByDateRangesForYear,
} from 'src/utils/date';
import { toFixedNumber } from 'src/utils/number';
import {
  getGroupOfAverageScore,
  isAbove,
  isBelow,
  isMeets,
} from 'src/utils/performanceGroup';

import {
  getSPLsByStudentIds,
  PerformanceLORecord,
} from './performanceLearningOutcome';

export interface PerformanceScoreRecord {
  studentId: UUID;
  sps: number;
  day: string;
  average: number;
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
  const studentsScore = await getStudentScores(
    classId,
    timezone,
    days,
    group,
    studentId
  );

  let studentsPerformanceLO: Array<PerformanceLORecord> = [];
  if (viewLOs) {
    studentsPerformanceLO = await getSPLsByStudentIds(
      classId,
      timezone,
      days,
      studentsScore.map((student) => student.studentId)
    );
  }

  if (studentId) {
    const studentAverage =
      studentsScore.find((item) => item.studentId === studentId)?.average ?? 0;
    group = getGroupOfAverageScore(studentAverage);
  }

  const performanceScores: Array<PerformanceScore> = [];
  const timezoneInSeconds = timezone * 60 * 60;
  const toDate = new Date(Date.now() + timezoneInSeconds * 1000);

  let dates = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let groupSPSByDate: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let groupSPLByDate: Record<string, any>;
  if (days !== 365) {
    let step = -1;
    let numberOfDates = 7;

    if (days == 30) {
      // will aggregate scores by week
      step = -7;
      numberOfDates = 4;
    }
    dates = generateDates(toDate, numberOfDates, step);
    groupSPSByDate = groupScoresByDateRanges(dates, studentsScore);
    groupSPLByDate = groupScoresByDateRanges(dates, studentsPerformanceLO);
  } else {
    dates = generateDatesForYear(toDate);
    groupSPSByDate = groupScoresByDateRangesForYear(dates, studentsScore);
    groupSPLByDate = groupScoresByDateRangesForYear(
      dates,
      studentsPerformanceLO
    );
  }

  Object.keys(groupSPSByDate).forEach((key) => {
    const spsByDate: { name: string; data: PerformanceScoreRecord[] } =
      groupSPSByDate[key];
    const splByDate: { name: string; data: PerformanceLORecord[] } =
      groupSPLByDate[key];
    const performanceScoreItem: PerformanceScore = { name: spsByDate.name };
    const isAll = group === 'all';

    if (isAll || group === 'above') {
      const aboveStudents = isAll
        ? spsByDate.data.filter((item) => isAbove(item.average))
        : spsByDate.data;
      performanceScoreItem.above = averageSPSOfGroup(aboveStudents);
      if (viewLOs) {
        performanceScoreItem.learningOutcome = {};
        performanceScoreItem.learningOutcome.above = averageSPLOfGroup(
          splByDate.data,
          aboveStudents.map((item) => item.studentId)
        );
      }
    }

    if (isAll || group === 'meets') {
      const meetsStudents = isAll
        ? spsByDate.data.filter((item) => isMeets(item.average))
        : spsByDate.data;
      performanceScoreItem.meets = averageSPSOfGroup(meetsStudents);
      if (viewLOs) {
        const tmpLO = performanceScoreItem.learningOutcome ?? {};
        delete performanceScoreItem.learningOutcome;
        performanceScoreItem.learningOutcome = tmpLO;
        performanceScoreItem.learningOutcome.meets = averageSPLOfGroup(
          splByDate.data,
          meetsStudents.map((item) => item.studentId)
        );
      }
    }

    if (isAll || group === 'below') {
      const belowStudents = isAll
        ? spsByDate.data.filter((item) => isBelow(item.average))
        : spsByDate.data;
      performanceScoreItem.below = averageSPSOfGroup(belowStudents);
      if (viewLOs) {
        const tmpLO = performanceScoreItem.learningOutcome ?? {};
        delete performanceScoreItem.learningOutcome;
        performanceScoreItem.learningOutcome = tmpLO;
        performanceScoreItem.learningOutcome.below = averageSPLOfGroup(
          splByDate.data,
          belowStudents.map((item) => item.studentId)
        );
      }
    }

    performanceScores.push(performanceScoreItem);
  });

  return performanceScores;
};

export const getStudentScores = async (
  classId: UUID,
  timezone: number,
  days: number,
  group: GroupType,
  studentId?: UUID
): Promise<Array<PerformanceScoreRecord>> => {
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  let tableName = 'reporting_spr_perform_by_score_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_score_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const daysAgoTimestampSQL = `(${nowTimestampSQL} - (${days} * 3600 * 24))`;

  const selectDaySQL = `
    CASE WHEN start_at = 0 THEN
      DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
    ELSE
      DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d')
    END
  `;

  const dayConditionSQL = `
    day >= DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') AND
    day <= DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d')
  `;

  const classConditionSQL = `
    class_id = '${classId}'
  `;

  const generateGroupStudentSQL = (groupType: GroupType) => {
    switch (groupType) {
      case 'above':
        return `AND average >= ${GROUP_UPPER_THRESHOLD}`;
      case 'meets':
        return `AND average >= ${GROUP_BELOW_THRESHOLD} AND average < ${GROUP_UPPER_THRESHOLD}`;
      case 'below':
        return `AND average < ${GROUP_BELOW_THRESHOLD}`;
      default:
        return '';
    }
  };

  const sql = `
  SELECT
      tb_score.student_id AS studentId,
      ${selectDaySQL} AS day,
      (SUM(achieved_score) * 100 / SUM(total_score)) AS sps,
      tb_average.average
  FROM ${tableName} AS tb_score,
    (
        SELECT student_id, AVG(sps) AS average
        FROM
        (
            SELECT
                student_id,
                (SUM(achieved_score) * 100 / SUM(total_score)) AS sps,
                ${selectDaySQL} AS day
            FROM ${tableName}
            WHERE
                ${classConditionSQL}
                ${
                  group === 'all' && studentId
                    ? `AND student_id = '${studentId}'`
                    : ''
                }
            GROUP BY
                student_id, day
            HAVING
                ${dayConditionSQL}
        ) AS tb_score_day
        GROUP BY
            student_id
    ) AS tb_average
  WHERE
      tb_score.student_id = tb_average.student_id
  AND
      ${classConditionSQL}
      ${
        group === 'all' && studentId
          ? `AND tb_score.student_id = '${studentId}'`
          : ''
      }
      ${generateGroupStudentSQL(group)}
  GROUP BY
      tb_score.student_id, day
  HAVING
      ${dayConditionSQL}
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

const averageSPLOfGroup = (
  studentsPerformanceLO: Array<PerformanceLORecord>,
  studentIds: UUID[]
) => {
  const group = studentsPerformanceLO.filter((student) =>
    studentIds.includes(student.studentId)
  );

  if (group.length === 0) return 0;

  const sumSPL = group
    .map((student) => student.spl)
    .reduce((spl1, spl2) => spl1 + spl2, 0);

  return toFixedNumber(sumSPL / group.length, 2);
};

const averageSPSOfGroup = (studentsScore: Array<PerformanceScoreRecord>) => {
  if (studentsScore.length === 0) return 0;

  const sumSPS = studentsScore
    .map((student) => student.sps)
    .reduce((sps1, sps2) => sps1 + sps2, 0);

  return toFixedNumber(sumSPS / studentsScore.length, 2);
};
