import { faker } from '@faker-js/faker';
import random from 'random';
import { Group } from 'src/models/group';
import { PerformanceScore, SkillScore } from 'src/models/performance';
import { Student } from 'src/models/student';
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
    @Query() timeZoneOffset = 0
  ): Promise<Array<PerformanceScore>> {
    const performanceScores: Array<PerformanceScore> = [];

    for (let i = 0; i < 5; i++) {
      performanceScores.push({
        name: new Date(faker.date.past().getTime() + timeZoneOffset * 1000)
          .toISOString()
          .split('T')[0],
        above: random.int(1, 100),
        meets: random.int(1, 100),
        below: random.int(1, 100),
        ...(random.boolean()
          ? {
              score: {
                above: random.int(1, 100),
                meets: random.int(1, 100),
                below: random.int(1, 100),
              },
            }
          : {}),
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
