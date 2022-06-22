import { ClassData, ClassesResponse } from 'src/models/class';
import prisma from 'src/prismaClient';
import { AdminService } from 'src/services';
import { UUID } from 'src/types';
import { getClassesInIdsSQL } from 'src/utils';
import { toFixedNumber } from 'src/utils/number';

import { getTodayStudentsScore } from './performanceScore';
import { getTodaySchedules } from './schedule';

export const getClasses = async (
  orgId: UUID,
  userId: UUID,
  isTeacher: boolean,
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

  const classes = await getClassesInIds({
    orgId,
    classIds: (await classesOfUser).map((item) => item.id),
  });

  const todaySchedules = await getTodaySchedules({
    orgId,
    timezone,
  });
  const todayStudentsScore = await getTodayStudentsScore({
    orgId,
    timezone,
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

    let averagePerformance = 0;
    if (studentsScoreOfClass.length !== 0) {
      averagePerformance = toFixedNumber(
        sumStudentsScore / studentsScoreOfClass.length,
        2
      );
    }

    const performanceData = {
      total_students: currentClass.totalStudents,
      average_performance: averagePerformance,
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
  const sql = await getClassesInIdsSQL(orgId, classIds);
  const classes = await prisma.$queryRaw(sql);
  if (!Array.isArray(classes)) throw new Error('Failed to get classes');
  return classes;
};
