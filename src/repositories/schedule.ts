import { PrismaClient, ScheduleA } from '@prisma/client';
import { UUID } from 'src/types';

export default class ScheduleRepository {
  prisma = new PrismaClient();

  async getSchedulesByDate({
    orgId,
    scheduleId,
    classId,
    date,
  }: {
    orgId?: UUID;
    scheduleId?: UUID;
    classId?: UUID;
    date: Date;
  }): Promise<ScheduleA[]> {
    const beginTimestamp = (date.setHours(0, 0, 0, 0) / 1000) | 0;
    const endTimestamp = (date.setHours(23, 59, 59, 59) / 1000) | 0;
    return await this.prisma.scheduleA.findMany({
      where: {
        ...(orgId ? { orgId } : {}),
        ...(scheduleId ? { scheduleId } : {}),
        ...(classId ? { classId } : {}),
        OR: [
          {
            startAt: {
              gte: beginTimestamp,
              lte: endTimestamp,
            },
          },
          {
            dueAt: {
              gte: beginTimestamp,
              lte: endTimestamp,
            },
          },
        ],
      },
    });
  }
}
