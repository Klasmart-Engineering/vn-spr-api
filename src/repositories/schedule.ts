import prisma from 'src/prismaClient';
import { UUID } from 'src/types';
import { getTodaySchedulesSQL } from 'src/utils';

export const getTodaySchedules = async ({
  orgId,
  timezone,
}: {
  orgId: UUID;
  timezone: number;
}): Promise<
  Array<{ scheduleId: UUID; classId: UUID; totalActivities: number }>
> => {
  const sql = await getTodaySchedulesSQL(orgId, timezone);
  const schedules = await prisma.$queryRaw(sql);
  if (!Array.isArray(schedules))
    throw new Error('Failed to get today students score');
  return schedules;
};
