import * as express from 'express';
import { Category, Group } from 'src/models';
import { PerformanceScore, PerformanceSkill } from 'src/models/performance';
import { getGroups } from 'src/repositories';
import { getCategories } from 'src/repositories/category';
import {
  getScores,
  getScoresOfSubcategories,
} from 'src/repositories/performanceScore';
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
  @Response<BadRequestErrorJSON>(400, 'bad request')
  @Response<UnauthorizedErrorJSON>(401, 'unauthorized')
  @Response<InternalServerErrorJSON>(500, 'internal server error')
  public async getSkillScores(
    @Query() classId: UUID,
    @Query() timezone: number,
    @Query() days: Days,
    @Query() viewLOs = false,
    /**
     * requires if `studentId` is empty
     */
    @Query() group: GroupType = 'all',
    /**
     * requires if `group` is empty
     */
    @Query() studentId?: string
  ): Promise<Array<PerformanceSkill>> {
    return await getScoresOfSubcategories(
      classId,
      timezone,
      days,
      viewLOs,
      group,
      studentId || ''
    );
  }
}
