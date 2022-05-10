import { PrismaClient } from '@prisma/client';
import { ReportEntity, UUID } from 'src/types';
import { getVerInUse } from 'src/utils/database';

const prisma = new PrismaClient();

export const getSchedulesOfDay = async ({
  orgId,
  selectedDay,
  timezoneInSeconds,
}: {
  orgId: UUID;
  selectedDay: string;
  timezoneInSeconds: number;
}): Promise<
  Array<{ scheduleId: UUID; classId: UUID; totalActivities: number }>
> => {
  const verInUse = await getVerInUse(ReportEntity.SCHEDULE);
  let tableName = 'reporting_spr_scheduled_classes_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_scheduled_classes_B';
  }

  const sql = `
    SELECT
      schedule_id AS scheduleId,
      class_id AS classId,
      total_activities AS totalActivities
    FROM
      ${tableName}
    WHERE
      org_id = '${orgId}'
    AND
      (
        DATE_FORMAT('${selectedDay}', '%Y-%m-%d') = DATE_FORMAT(FROM_UNIXTIME(start_at + ${timezoneInSeconds}), '%Y-%m-%d') OR
        DATE_FORMAT('${selectedDay}', '%Y-%m-%d') = DATE_FORMAT(FROM_UNIXTIME(due_at + ${timezoneInSeconds}), '%Y-%m-%d')
      );
    `;
  const schedules = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(schedules))
    throw new Error('Failed to get students score');
  return schedules;
};
