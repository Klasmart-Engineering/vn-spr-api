import { PrismaClient } from '@prisma/client';
import { ReportEntity, UUID } from 'src/types';
import { groupBy } from 'src/utils';
import { getVerInUse } from 'src/utils/database';

export interface PerformanceLORecord {
  studentId: UUID;
  spl: number;
  day: string;
}

export interface SubcategoryLO {
  category: UUID;
  category_name: string;
  subcategory: UUID;
  subcategory_name: string;
  achieved: number;
  notAchieved: number;
  total: number;
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const getSPLsByStudentIds = async (
  classId: UUID,
  timezone: number,
  days: number,
  studentIds: UUID[]
): Promise<Array<PerformanceLORecord>> => {
  if (studentIds.length === 0) return [];

  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_LEARNING_OUTCOME);
  const tableName = `reporting_spr_perform_by_lo_${verInUse}`;

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
      ${userWhereCondition}
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

export const getSubcategoriesLOsByStudentIds = async (
  classId: UUID,
  timezone: number,
  days: number,
  studentIds: UUID[]
): Promise<Record<string, SubcategoryLO[]>> => {
  if (studentIds.length === 0) return {};

  const verInUse = await getVerInUse(ReportEntity.PERFORMANCE_LEARNING_OUTCOME);
  const tableName = `reporting_spr_perform_by_lo_${verInUse}`;
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
      subcategory_name AS subcategoryName,
      COUNT(CASE WHEN status = 'Achieved' THEN 1 ELSE NULL END) AS achieved,
      COUNT(CASE WHEN status = 'NotAchieved' THEN 1 ELSE NULL END) AS notAchieved,
      (COUNT(CASE WHEN status = 'Achieved' THEN 1 ELSE NULL END) + COUNT(CASE WHEN status = 'NotAchieved' THEN 1 ELSE NULL END)) AS total
    FROM
      ${tableName}
    WHERE
      class_id = '${classId}'
      AND DATE_FORMAT(FROM_UNIXTIME(${daysAgoTimestampSQL}), '%Y-%m-%d') < ${dateCaseWhenSQL}
      AND DATE_FORMAT(FROM_UNIXTIME(${nowTimestampSQL}), '%Y-%m-%d') >= ${dateCaseWhenSQL}
      ${userWhereCondition}
    GROUP BY category, category_name, subcategory, subcategory_name;
    `;

  const learningOutcomeWithSubcategories = await prisma.$queryRawUnsafe(
    `${sql}`
  );
  if (!Array.isArray(learningOutcomeWithSubcategories))
    throw new Error('Failed to get students performance LO');
  if (!learningOutcomeWithSubcategories.length) return {};

  const groupLearningOutcomeByCategory = groupBy(
    learningOutcomeWithSubcategories,
    'category'
  );

  return groupLearningOutcomeByCategory;
};
