import { faker } from '@faker-js/faker';
import * as express from 'express';
import random from 'random';
import { Category, Group } from 'src/models';
import { PerformanceScore, SkillScore } from 'src/models/performance';
import { getGroups } from 'src/repositories';
import { getCategories } from 'src/repositories/category';
import { getScores } from 'src/repositories/performanceScore';
import { Days, GroupType, UUID } from 'src/types';
import {
  BadRequestErrorJSON,
  InternalServerErrorJSON,
  UnauthorizedErrorJSON,
} from 'src/utils';
import {
  Get,
  OperationId,
  Query,
  Request,
  Response,
  Route,
  Security,
  Tags,
} from 'tsoa';

export interface PerformanceGroupsResponse {
  above: Group;
  meets: Group;
  below: Group;
}

export interface SkillScoresReport {
  date: string;
  data: Array<SkillScore>;
}

interface CategoriesResponse {
  total: number;
  categories: Category[];
}

@Route('v1/performances')
@Tags('performances')
export default class PerformanceController {
  @OperationId('getPerformanceScores')
  @Get('/')
  @Security('Authorization')
  @Response<BadRequestErrorJSON>(400, 'bad request')
  @Response<UnauthorizedErrorJSON>(401, 'unauthorized')
  @Response<InternalServerErrorJSON>(500, 'internal server error')
  public async getPerformanceScores(
    @Query() classId: UUID,
    @Query() timezone: number,
    @Query() days: Days,
    @Query() viewLOs = false,
    @Query() group: GroupType = 'all',
    @Query() studentId = ''
  ): Promise<Array<PerformanceScore>> {
    return await getScores(classId, timezone, days, viewLOs, group, studentId);
  }

  @OperationId('getPerformanceGroups')
  @Get('/groups')
  @Security('Authorization')
  @Response<BadRequestErrorJSON>(400, 'bad request')
  @Response<UnauthorizedErrorJSON>(401, 'unauthorized')
  @Response<InternalServerErrorJSON>(500, 'internal server error')
  public async getPerformanceGroups(
    @Query() classId: UUID,
    @Query() timezone: number,
    @Request() request: express.Request
  ): Promise<PerformanceGroupsResponse> {
    const token = request.get('Authorization') as string;

    return await getGroups(classId, timezone, token);
  }

  @OperationId('getPerformanceCategories')
  @Get('/categories')
  @Security('Authorization')
  @Response<BadRequestErrorJSON>(400, 'bad request')
  @Response<UnauthorizedErrorJSON>(401, 'unauthorized')
  @Response<InternalServerErrorJSON>(500, 'internal server error')
  public async getPerformanceCategories(
    @Query() classId: UUID,
    @Query() timezone: number,
    @Query() days: Days
  ): Promise<CategoriesResponse> {
    const categories = await getCategories(classId, timezone, days);

    return {
      total: categories.length,
      categories: categories,
    };
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
