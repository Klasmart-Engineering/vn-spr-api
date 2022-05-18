import { PrismaClient } from '@prisma/client';
import {
  PerformanceScore,
  PerformanceSkill,
  PerformanceSubcategories,
} from 'src/models/performance';
import { Days, GroupType, ReportEntity, UUID } from 'src/types';
import {
  generateDates,
  generateDatesForYear,
  getVerInUse,
  groupBy,
  groupScoresByDateRanges,
  groupScoresByDateRangesForYear,
  toFixedNumber,
} from 'src/utils';
import {
  getGroupOfAverageScore,
  isAbove,
  isBelow,
  isMeets,
} from 'src/utils/performanceGroup';

import { getStudentsScoreByDay } from './group';
import {
  getSPLsByStudentIds,
  getSubcategoriesLOsByStudentIds,
  PerformanceLORecord,
  SubcategoryLO,
} from './performanceLearningOutcome';

import { getStudentIdsFromGroups, getStudentsInGroups } from '.';

export interface PerformanceScoreRecord {
  studentId: UUID;
  sps: number;
  day: string;
  average: number;
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const getScores = async (
  classId: UUID,
  timezone: number,
  days: Days,
  viewLOs: boolean,
  group: GroupType,
  studentId: UUID
) => {
  let studentsScoreByDay = await getStudentsScoreByDay(classId, timezone);

  if (!Array.isArray(studentsScoreByDay)) {
    throw new Error(`Failed to get students score.`);
  }
  if (!studentsScoreByDay.length) {
    // doesn't have any data in DB
    return [];
  }
  if(studentId) {
    studentsScoreByDay = studentsScoreByDay.filter(s => s.student_id === studentId);
  }
  const studentIdsWithScoreAndDaysCount: Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>
  > = {};
  studentsScoreByDay.forEach((s) => {
    if (!studentIdsWithScoreAndDaysCount[s.student_id]) {
      studentIdsWithScoreAndDaysCount[s.student_id] = {
        days: 1,
        totalScore: s.score,
      };
    } else {
      studentIdsWithScoreAndDaysCount[s.student_id].days += 1;
      studentIdsWithScoreAndDaysCount[s.student_id].totalScore += s.score;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let studentIdsWithAverage: Record<string, Record<string, any>> = {};
  Object.keys(studentIdsWithScoreAndDaysCount).forEach((student_id) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { days, totalScore } = studentIdsWithScoreAndDaysCount[student_id];
    studentIdsWithAverage[student_id] = {
      days: days,
      totalScore: totalScore,
      average: totalScore / days,
    };
  });

  studentIdsWithAverage = filterStudentsByGroup(studentIdsWithAverage, group);

  const studentsScore = await getSPSsByStudentIds(
    classId,
    timezone,
    days,
    Object.keys(studentIdsWithAverage)
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
    group = getGroupOfAverageScore(studentIdsWithAverage[studentId].average);
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
        ? spsByDate.data.filter((s) =>
            isAbove(studentIdsWithAverage[s.studentId].average)
          )
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
        ? spsByDate.data.filter((s) =>
            isMeets(studentIdsWithAverage[s.studentId].average)
          )
        : spsByDate.data;
      performanceScoreItem.meets = averageSPSOfGroup(meetsStudents);
      if (viewLOs) {
        performanceScoreItem.learningOutcome = {
          ...performanceScoreItem.learningOutcome,
        };
        performanceScoreItem.learningOutcome.meets = averageSPLOfGroup(
          splByDate.data,
          meetsStudents.map((item) => item.studentId)
        );
      }
    }

    if (isAll || group === 'below') {
      const belowStudents = isAll
        ? spsByDate.data.filter((s) =>
            isBelow(studentIdsWithAverage[s.studentId].average)
          )
        : spsByDate.data;
      performanceScoreItem.below = averageSPSOfGroup(belowStudents);
      if (viewLOs) {
        performanceScoreItem.learningOutcome = {
          ...performanceScoreItem.learningOutcome,
        };
        performanceScoreItem.learningOutcome.below = averageSPLOfGroup(
          splByDate.data,
          belowStudents.map((item) => item.studentId)
        );
      }
    }

    //Reorganize order
    performanceScores.push(
      JSON.parse(
        JSON.stringify(performanceScoreItem, [
          'name',
          'above',
          'meets',
          'below',
          'learningOutcome',
        ])
      )
    );
  });

  return performanceScores;
};

export const getSPSsByStudentIds = async (
  classId: UUID,
  timezone: number,
  days: number,
  studentIds: UUID[]
): Promise<Array<PerformanceScoreRecord>> => {
  if (studentIds.length === 0) return [];

  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_LEARNING_OUTCOME);
  let tableName = 'reporting_spr_perform_by_score_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_score_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const daysAgoTimestampSQL = `(${nowTimestampSQL} - (${days} * 3600 * 24))`;

  let userWhereCondition = '';
  if (studentIds.length > 0) {
    userWhereCondition = `AND student_id IN (${studentIds
      .map((item) => `'${item}'`)
      .join(',')})`;
  }

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
      ${userWhereCondition}
    GROUP BY studentId, day
    HAVING
      day >= DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') AND
      day <= DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d')
    ORDER BY day DESC;
    `;

  const studentsPerformLO = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(studentsPerformLO))
    throw new Error('Failed to get students performance score');
  return studentsPerformLO;
};

export const getTodayStudentsScore = async ({
  orgId,
  timezone,
}: {
  orgId: UUID;
  timezone: number;
}): Promise<
  Array<{ classId: UUID; studentId: UUID; sps: number; day: string }>
> => {
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  let tableName = 'reporting_spr_perform_by_score_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_perform_by_score_B';
  }

  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;

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
      day = DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d')
    ORDER BY day DESC;
    `;

  const studentsScore = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(studentsScore))
    throw new Error('Failed to get today students score');
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

const filterStudentsByGroup = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  studentIdsWithAverage: Record<string, any>,
  group: GroupType
) => {
  if (group === 'all') return studentIdsWithAverage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tempStudentIdsWithAverage: Record<string, any> = {};
  switch (group) {
    case 'above':
      Object.keys(studentIdsWithAverage).forEach((k) => {
        if (isAbove(studentIdsWithAverage[k].average)) {
          tempStudentIdsWithAverage[k] = studentIdsWithAverage[k];
        }
      });
      break;
    case 'meets':
      Object.keys(studentIdsWithAverage).forEach((k) => {
        if (isMeets(studentIdsWithAverage[k].average)) {
          tempStudentIdsWithAverage[k] = studentIdsWithAverage[k];
        }
      });
      break;
    case 'below':
      Object.keys(studentIdsWithAverage).forEach((k) => {
        if (isBelow(studentIdsWithAverage[k].average)) {
          tempStudentIdsWithAverage[k] = studentIdsWithAverage[k];
        }
      });
      break;
  }
  return tempStudentIdsWithAverage;
};

/**
 * If `student_id` has value, will ignore `group`
 *
 * @param classId
 * @param timezone
 * @param days
 * @param viewLOs
 * @param group
 * @param studentId
 * @returns
 */
export const getScoresOfSubcategories = async (
  classId: UUID,
  timezone: number,
  days: Days,
  viewLOs: boolean,
  group: GroupType,
  studentId: UUID
): Promise<PerformanceSkill[]> => {
  const studentsInGroups = await getStudentsInGroups(
    classId,
    timezone,
    studentId
  );
  // Get student IDs for getting scores
  let studentIds: string[] = [];
  if (studentId) {
    studentIds.push(studentId);
  } else {
    studentIds = getStudentIdsFromGroups(studentsInGroups, group);
  }

  // Get students' score of subcategories
  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_SCORE);
  const tableName = `reporting_spr_perform_by_score_${verInUse}`;
  const timezoneInSeconds = timezone * 60 * 60;
  const nowTimestampSQL = `UNIX_TIMESTAMP() + ${timezoneInSeconds}`;
  const daysAgoTimestampSQL = `(${nowTimestampSQL} - (${days} * 3600 * 24))`;

  const dateCaseWhenSQL = `
  CASE WHEN start_at = 0 THEN
    DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
  ELSE
    DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d')
  END`;

  let userWhereCondition = '';
  if (studentIds.length > 0) {
    userWhereCondition = `AND student_id IN (${studentIds
      .map((item) => `'${item}'`)
      .join(',')})`;
  }

  const sql = `
  SELECT
    category,
    category_name AS categoryName,
    subcategory,
	  subcategory_name AS name,
    SUM(achieved_score) AS achieved,
    SUM(total_score) - SUM(achieved_score) AS notAchieved,
	  SUM(total_score) AS total
  FROM
    ${tableName}
  WHERE
    class_id = '${classId}'
    AND DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') < ${dateCaseWhenSQL}
    AND DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d') >= ${dateCaseWhenSQL}
    ${userWhereCondition}
  GROUP BY category, category_name, subcategory, subcategory_name;
  `;

  const studentsSkillPerformance = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(studentsSkillPerformance))
    throw new Error('Failed to get students score with subcategories.');
  if (!studentsSkillPerformance.length) return [];

  const groupSkillByCategory = groupBy(studentsSkillPerformance, 'category');

  // Get learning outcomes
  let subcategoriesLOs: Record<string, SubcategoryLO[]>;
  if (viewLOs) {
    subcategoriesLOs = await getSubcategoriesLOsByStudentIds(
      classId,
      timezone,
      days,
      studentIds
    );
  }

  const result: PerformanceSkill[] = [];
  Object.keys(groupSkillByCategory).map((categoryId) => {
    const subcategories: PerformanceSubcategories[] = [];
    groupSkillByCategory[categoryId].map(
      ({
        name,
        subcategoryId,
        achieved,
        notAchieved,
        total,
      }: {
        name: string;
        subcategoryId: UUID;
        achieved: number;
        notAchieved: number;
        total: number;
      }) => {
        const skill: PerformanceSubcategories = {
          name,
          achieved,
          notAchieved,
          total,
        };
        if (viewLOs) {
          const skillLO = subcategoriesLOs[subcategoryId]?.find(
            (lo) => lo.subcategory === subcategoryId
          );
          skill.learningOutcome = {
            achieved: skillLO?.achieved || 0,
            notAchieved: skillLO?.notAchieved || 0,
            total: skillLO?.total || 0,
          };
        }
        subcategories.push(skill);
      }
    );
    result.push({
      category: groupSkillByCategory[categoryId][0].categoryName,
      subcategories: subcategories,
    });
  });

  return result;
};
