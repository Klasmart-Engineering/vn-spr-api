import { faker } from '@faker-js/faker';
import random from 'random';
import { Group } from 'src/models/group';
import { PerformanceScore, SkillScore } from 'src/models/performance';
import { Student } from 'src/models/student';
import PerformanceScoreRepository from 'src/repositories/performanceScore';
import { UUID } from 'src/types';
import { dateDiff, plusDate } from 'src/utils/date';
import { Get, OperationId, Query, Route, Security, Tags } from 'tsoa';

export interface PeformanceGroupsResponse {
  above: Group;
  meets: Group;
  below: Group;
}

export interface SkillScoresReport {
  date: string;
  data: Array<SkillScore>;
}

@Route('v1/performances')
@Tags('performances')
export default class PerformanceController {
  @OperationId('getPerformanceScores')
  @Get('/')
  @Security('Authorization')
  public async getPerformanceScores(
    @Query() classId: UUID,
    @Query() fromDay = '',
    @Query() toDay = '',
    @Query() timeZoneOffset = 0
  ): Promise<Array<PerformanceScore>> {
    const defaultDays = 7;
    const fromDate = fromDay
      ? new Date(Date.parse(fromDay))
      : new Date(
          Date.now() - (defaultDays * 3600 * 24 + timeZoneOffset) * 1000
        );
    const toDate = toDay
      ? new Date(Date.parse(toDay))
      : new Date(Date.now() + timeZoneOffset * 1000);
    const performanceScoreRepository = new PerformanceScoreRepository();

    const studentsScore =
      await performanceScoreRepository.getStudentScoresOfClassInPeriod({
        classId: classId,
        fromDay: fromDate.toISOString().split('T')[0],
        toDay: toDate.toISOString().split('T')[0],
        timezoneInSeconds: timeZoneOffset,
      });

    const performanceScores: Array<PerformanceScore> = [];

    for (let i = 0; i <= dateDiff(fromDate, toDate); i++) {
      const date = plusDate(fromDate, i);
      const dayName = date.toISOString().split('T')[0];

      const aboveStudentsScore = studentsScore.filter(
        (score) => score.day === dayName && score.sps >= 75
      );
      const meetsStudentsScore = studentsScore.filter(
        (score) => score.day === dayName && score.sps >= 50 && score.sps < 75
      );
      const belowStudentsScore = studentsScore.filter(
        (score) => score.day === dayName && score.sps < 50
      );

      performanceScores.push({
        name: dayName,
        above:
          (aboveStudentsScore
            .map((score) => score.sps)
            .reduce((score1, score2) => score1 + score2, 0) /
            aboveStudentsScore.length) |
          0,
        meets:
          (meetsStudentsScore
            .map((score) => score.sps)
            .reduce((score1, score2) => score1 + score2, 0) /
            meetsStudentsScore.length) |
          0,
        below:
          (belowStudentsScore
            .map((score) => score.sps)
            .reduce((score1, score2) => score1 + score2, 0) /
            belowStudentsScore.length) |
          0,
      });
    }

    return performanceScores;
  }

  @OperationId('getPerformanceGroups')
  @Get('/groups')
  @Security('Authorization')
  public async getPerformanceGroups(): Promise<PeformanceGroupsResponse> {
    const performanceGroups: PeformanceGroupsResponse = {
      above: this.generateGroup(),
      meets: this.generateGroup(),
      below: this.generateGroup(),
    };

    return performanceGroups;
  }

  @OperationId('getPerformanceSkills')
  @Get('/skills')
  @Security('Authorization')
  public async getSkillScores(): Promise<Array<SkillScoresReport>> {
    const skillScoresReports: Array<SkillScoresReport> = [];

    for (let i = 0; i < 5; i++) {
      skillScoresReports.push({
        date: faker.date.past().toISOString().split('T')[0],
        data: this.generateSkillScores(),
      });
    }

    return skillScoresReports;
  }

  private generateGroup(): Group {
    const students: Array<Student> = [];
    const totalStudents = random.int(1, 20);

    for (let i = 0; i < totalStudents; i++) {
      students.push({
        student_id: faker.datatype.uuid(),
        student_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        avatar: faker.image.imageUrl(),
      });
    }

    return {
      total: totalStudents,
      students: students,
    };
  }

  private generateSkillScores() {
    const skillNames = [
      'Cognitive Skill',
      'Subject Matter',
      'Speech & Language',
      'Personal Development',
      'Gross Motor Skills',
    ];
    const skillScores: Array<SkillScore> = [];

    for (let i = 0; i < skillNames.length; i++) {
      const achieved = random.int(1, 50);
      const notAchieved = random.int(1, 50);
      skillScores.push({
        name: skillNames[i],
        achieved: achieved,
        notAchieved: notAchieved,
        total: achieved + notAchieved,
        ...(random.boolean()
          ? {
              score: {
                achieved: achieved,
                notAchieved: notAchieved,
                total: achieved + notAchieved,
              },
            }
          : {}),
      });
    }

    return skillScores;
  }
}
