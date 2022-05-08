import ClassRepository from 'src/repositories/class';
import PerformanceScoreRepository from 'src/repositories/performanceScore';
import ScheduleRepository from 'src/repositories/schedule';
import { UUID } from 'src/types';
import { toFixedNumber } from 'src/utils/number';
import { Get, OperationId, Query, Route, Security, Tags } from 'tsoa';

export interface PerformanceData {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}
export interface ClassData {
  class_id: UUID;
  class_name: string;
  performance: PerformanceData;
}
export interface ClassesResponse {
  total: number;
  classes: Array<ClassData>;
}

@Route('v1/classes')
@Tags('classes')
export default class ClassController {
  @OperationId('getClasses')
  @Get('/')
  @Security('Authorization')
  public async getClasses(
    @Query() orgId: UUID,
    @Query() selectedDay = '',
    @Query() timeZoneOffset = 0
  ): Promise<ClassesResponse> {
    const selectedDate = selectedDay
      ? new Date(selectedDay)
      : new Date(Date.now() + timeZoneOffset * 1000);

    const classRepository = new ClassRepository();
    const scheduleRepository = new ScheduleRepository();
    const performanceScoreRepository = new PerformanceScoreRepository();

    const classes = await classRepository.getClasses({ orgId });
    const todaySchedules = await scheduleRepository.getSchedulesOfDay({
      orgId,
      selectedDay: selectedDate.toISOString().split('T')[0],
      timezoneInSeconds: timeZoneOffset,
    });
    const todayStudentsScore =
      await performanceScoreRepository.getStudentsScoreOfDay({
        orgId,
        selectedDay: selectedDate.toISOString().split('T')[0],
        timezoneInSeconds: timeZoneOffset,
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
          sumStudentsScore / studentsScoreOfClass.length,
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

    return {
      total: classes.length,
      classes: classesData,
    };
  }
}
