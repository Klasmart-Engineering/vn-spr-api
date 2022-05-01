import * as express from 'express';
import { Get, OperationId, Path, Request, Route, Security, Tags } from 'tsoa';

import { Permission } from '../../models';
import { getPermission } from '../../repositories';

@Route('v1/permissions')
@Tags('permissions')
export default class PermissionController {
  @OperationId('getPermission')
  @Get('/:name')
  @Security('Authorization')
  public async getPermission(
    @Path() name: string,
    @Request() request: express.Request
  ): Promise<Permission | null> {
    const token = request.get('Authorization') as string;

    return getPermission(name, token);
  }
}
