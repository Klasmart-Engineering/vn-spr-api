import { PrismaClient } from '@prisma/client';
import { ClassData, ClassesResponse } from 'src/models/class';
import { AdminService } from 'src/services';
import { ReportEntity, UUID } from 'src/types';
import { getVerInUse } from 'src/utils/database';
import { toFixedNumber } from 'src/utils/number';

import { getStudentsScoreOfDay } from './performanceScore';
import { getSchedulesOfDay } from './schedule';

const prisma = new PrismaClient();

export const getClasses = async (
  orgId: UUID,
  userId: UUID,
  isTeacher: boolean,
  selectedDay: string,
  timezone: number,
  token: string
) => {
  const classesResponse: ClassesResponse = {
    total: 0,
    classes: [],
  };
  const adminService = await AdminService.getInstance(token);
  const classesOfUser = await adminService.getClassesOfOrgId(
    orgId,
    userId,
    isTeacher
  );

  if (classesOfUser.length === 0) return classesResponse;

  const timezoneInSeconds = timezone * 60 * 60;
  selectedDay = selectedDay ?? new Date(Date.now() + timezoneInSeconds * 1000).toISOString().split('T')[0];

  const classes = await getClassesInIds({
    orgId,
    classIds: (await classesOfUser).map((item) => item.id),
  });

  const todaySchedules = await getSchedulesOfDay({
    orgId,
    selectedDay,
    timezoneInSeconds,
  });
  const todayStudentsScore = await getStudentsScoreOfDay({
    orgId,
    selectedDay,
    timezoneInSeconds,
  });

  const classesData: Array<ClassData> = [];
  for (let i = 0; i < classes.length; i++) {
    const currentClass = classes[i];
    const todaySchedulesOfClass = todaySchedules.filter(
      (schedule) => schedule.classId === currentClass.classId
    );
    const studentsScoreOfClass = todayStudentsScore.filter(
      (score) => score.classId === currentClass.classId
    );

    const sumStudentsScore = studentsScoreOfClass
      .map((student) => student.sps)
      .reduce((score1, score2) => score1 + score2, 0);

    const performanceData = {
      total_students: currentClass.totalStudents,
      average_performance: toFixedNumber(
        (sumStudentsScore / studentsScoreOfClass.length) | 0,
        2
      ),
      today_total_classes: todaySchedulesOfClass.length,
      today_activities: todaySchedulesOfClass
        .map((schedule) => schedule.totalActivities)
        .reduce(
          (totalActivities1, totalActivities2) =>
            totalActivities1 + totalActivities2,
          0
        ),
    };

    classesData.push({
      class_id: currentClass.classId,
      class_name: currentClass.className,
      performance: performanceData,
    });
  }
  classesResponse.total = classes.length;
  classesResponse.classes = classesData;
  return classesResponse;
};

const getClassesInIds = async ({
  orgId,
  classIds,
}: {
  orgId: UUID;
  classIds: UUID[];
}): Promise<
  Array<{
    classId: string;
    className: string;
    totalStudents: number;
    studentIds: string;
  }>
> => {
  const verInUse = await getVerInUse(ReportEntity.CLASS);
  let tableName = 'reporting_spr_class_roster_A';
  if (verInUse === 'B') {
    tableName = 'reporting_spr_class_roster_B';
  }

  const sql = `
    SELECT
      class_id AS classId,
      class_name AS className,
      total_students AS totalStudents,
      student_ids AS studentIds
    FROM ${tableName}
    WHERE org_id = '${orgId}'
    AND class_id IN(${classIds.map((item) => `'${item}'`).join(',')})
    `;

  const classes = await prisma.$queryRawUnsafe(`${sql}`);
  if (!Array.isArray(classes)) throw new Error('Failed to get classes');
  return classes;
};
