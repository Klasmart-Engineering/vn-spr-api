import { ScheduleA } from '@prisma/client';
import ClassRepository from 'src/repositories/class';
import PerformanceScoreRepository, {
  StudentPerfromanceScore,
} from 'src/repositories/performanceScore';
import ScheduleRepository from 'src/repositories/schedule';
import { UUID } from 'src/types';
import { getCurrentDateWithTimeZoneOffset } from 'src/utils/date';
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
    @Query() date = '',
    @Query() timeZoneOffset = 0
  ): Promise<ClassesResponse> {
    const selectedDate = date
      ? new Date(date)
      : getCurrentDateWithTimeZoneOffset(timeZoneOffset * 1000);

    const classRepository = new ClassRepository();
    const scheduleRepository = new ScheduleRepository();
    const performanceScoreRepository = new PerformanceScoreRepository();

    const classes = await classRepository.getClasses({ orgId });
    const todaySchedules = await scheduleRepository.getSchedulesByDate({
      orgId,
      date: selectedDate,
    });
    const todayPerformanceScoresOfStudents =
      (await performanceScoreRepository.getPerformanceScoreOfStudentsByDate({
        orgId,
        date: selectedDate,
      })) as Array<StudentPerfromanceScore>;

    const classesData: Array<ClassData> = [];
    for (let i = 0; i < classes.length; i++) {
      const currentClass = classes[i];
      const todaySchedulesOfClass = this.filterSchedulesOfClass(
        todaySchedules,
        currentClass.classId
      );

      const performanceData = {
        total_students: currentClass.totalStudents,
        average_performance: this.calculateAveragePerformance(
          currentClass.classId,
          todayPerformanceScoresOfStudents
        ),
        today_total_classes: todaySchedulesOfClass.length,
        today_activities: this.sumTotalActivities(todaySchedulesOfClass),
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

  private calculateAveragePerformance(
    classId: UUID,
    studentPerformanceScores: Array<StudentPerfromanceScore>
  ): number {
    const studentPerformanceScoresOfClass = studentPerformanceScores.filter(
      (sps) => sps.classId === classId
    );

    const sumStudentPerformanceScore = this.sumStudentPerformanceScore(
      studentPerformanceScoresOfClass
    );

    const totalStudents = studentPerformanceScoresOfClass.length;
    if (totalStudents === 0) return 0;
    return toFixedNumber(sumStudentPerformanceScore / totalStudents, 2);
  }

  private sumStudentPerformanceScore(
    studentPerformanceScores: Array<StudentPerfromanceScore>
  ) {
    return studentPerformanceScores
      .map((sps) => sps.performanceScore)
      .reduce(
        (performanceScore1, performanceScore2) =>
          performanceScore1 + performanceScore2,
        0
      );
  }

  private filterSchedulesOfClass(schedules: Array<ScheduleA>, classId: UUID) {
    return schedules.filter((schedule) => schedule.classId === classId);
  }

  private sumTotalActivities(schedules: Array<ScheduleA>): number {
    return schedules
      .map((schedule) => schedule.totalActivities)
      .reduce(
        (totalActivities1, totalActivities2) =>
          totalActivities1 + totalActivities2,
        0
      );
  }
}
