import { checkAuthenticationToken } from '@kl-engineering/kidsloop-token-validation';
import * as express from 'express';
import { ClassesResponse } from 'src/models/class';
import { getClasses } from 'src/repositories/class';
import { UUID } from 'src/types';
import {
  BadRequestErrorJSON,
  InternalServerErrorJSON,
  UnauthorizedErrorJSON,
} from 'src/utils/error';
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
@Route('v1/classes')
@Tags('classes')
export default class ClassController {
  @OperationId('getClasses')
  @Get('/')
  @Security('Authorization')
  @Response<BadRequestErrorJSON>(400, 'bad request')
  @Response<UnauthorizedErrorJSON>(401, 'unauthorized')
  @Response<InternalServerErrorJSON>(500, 'internal server error')
  public async getPerformanceClasses(
    @Request() request: express.Request,
    @Query() orgId: UUID,
    @Query() isTeacher: boolean,
    @Query() timezone: number
  ): Promise<ClassesResponse> {
    const token = request.get('Authorization') as string;
    const user = await checkAuthenticationToken(token);
    if (!user.id) throw new Error('No userId in token');

    return await getClasses(
      orgId,
      user.id,
      isTeacher,
      timezone,
      token
    );
  }
}
