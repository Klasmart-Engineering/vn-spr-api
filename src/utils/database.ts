import { Prisma } from '@prisma/client';
import prisma from 'src/prismaClient';
import { ReportEntity, UUID } from 'src/types';

import { timezoneToSeconds } from './date';

export const getTableNameInUse = async (reportEntity: ReportEntity): Promise<string> => {
  const datasetId = getDatasetId(reportEntity);

  try {
    const dataSet = await prisma.switchTable.findUnique({
      where: {
        datasetId: datasetId,
      },
    });

    if (!dataSet) throw new Error(`DatasetId ${datasetId} is invalid.`);

    return `${datasetId}_${dataSet?.verInUse}`;
  } catch (error) {
    throw new Error(`Failed to get VerInUse with error ${error}.`);
  }
}

//TODO: This function will be remove, and replaced with getTableNameInUse
export const getVerInUse = async (reportEntity: ReportEntity): Promise<string> => {
  const datasetId = getDatasetId(reportEntity);

  try {
    const dataSet = await prisma.switchTable.findUnique({
      where: {
        datasetId: datasetId,
      },
    });

    if (!dataSet) throw new Error(`DatasetId ${datasetId} is invalid.`);

    return dataSet?.verInUse;
  } catch (error) {
    throw new Error(`Failed to get VerInUse with error ${error}.`);
  }
}

function getDatasetId(reportEntity: ReportEntity) {
  let datasetId = 'reporting_spr_perform_by_lo';
  switch (reportEntity) {
    case ReportEntity.CLASS:
      datasetId = 'reporting_spr_class_roster';
      break;

    case ReportEntity.SCHEDULE:
      datasetId = 'reporting_spr_scheduled_classes';
      break;

    case ReportEntity.PERFORMANCE_SCORE:
      datasetId = 'reporting_spr_perform_by_score';
      break;

    default:
      break;
  }

  return datasetId;
}

const startAtDateFormatSQL = (timezone: number) => {
  return Prisma.sql`DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneToSeconds(timezone)}), '%Y-%m-%d')`;
}

const dueAtDateFormatSQL = (timezone: number) => {
  return Prisma.sql`DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneToSeconds(timezone)}), '%Y-%m-%d')`;
}

const nowDateFormatSQL = (timezone: number) => {
  return Prisma.sql`DATE_FORMAT(FROM_UNIXTIME(UNIX_TIMESTAMP() + ${timezoneToSeconds(timezone)}), '%Y-%m-%d')`;
}

export const getClassesInIdsSQL = async (orgId: UUID, classIds: UUID[]) => {
  const tableName = await getTableNameInUse(ReportEntity.CLASS);

  const sql = Prisma.sql`
    SELECT
      class_id AS classId,
      class_name AS className,
      total_students AS totalStudents,
      student_ids AS studentIds
    FROM ${Prisma.raw(tableName)}
    WHERE
      org_id = ${orgId}
      AND class_id IN(${Prisma.join(classIds)})
    `;

  return sql;
};

export const getTodaySchedulesSQL = async (orgId: UUID, timezone: number) => {
  const tableName = await getTableNameInUse(ReportEntity.SCHEDULE);

  const sql = Prisma.sql`
    SELECT
      schedule_id AS scheduleId,
      class_id AS classId,
      total_activities AS totalActivities
    FROM
      ${Prisma.raw(tableName)}
    WHERE
      org_id = ${orgId}
    AND
      (
        ${nowDateFormatSQL(timezone)} = ${startAtDateFormatSQL(timezone)}
        OR
        ${nowDateFormatSQL(timezone)} = ${dueAtDateFormatSQL(timezone)}
      );
    `;
  return sql;
};

export const getTodayStudentsScoreSQL = async (orgId: UUID, timezone: number) => {
  const tableName = await getTableNameInUse(ReportEntity.PERFORMANCE_SCORE);

  const sql = Prisma.sql`
    SELECT
      class_id AS classId,
      student_id AS studentId,
      (SUM(achieved_score) * 100 / SUM(total_score)) AS sps,
      CASE WHEN start_at = 0 THEN
        ${dueAtDateFormatSQL(timezone)}
      ELSE
        ${startAtDateFormatSQL(timezone)}
      END AS day
    FROM
      ${Prisma.raw(tableName)}
    WHERE
      org_id = ${orgId}
    GROUP BY classId, studentId, day
    HAVING
      day = ${nowDateFormatSQL(timezone)}
    ORDER BY day DESC;
    `;
  return sql;
};
