import { checkAuthenticationToken } from '@kl-engineering/kidsloop-token-validation';
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { catchAsync } from 'src/utils';

export const checkToken = catchAsync(
  async (req: Request, _: Response, next: NextFunction) => {
    const token = req.get('Authorization');
    let errorMessage = 'Unauthorized.';
    if (!token) {
      throw createError(401, { message: errorMessage });
    }
    try {
      const authenticationDetails = await checkAuthenticationToken(token);
      if (authenticationDetails) {
        return next();
      }
    } catch (error: Error | unknown) {
      errorMessage = error instanceof Error ? error.message : errorMessage;
      throw createError(401, { message: errorMessage });
    }

    throw createError(401, { message: errorMessage });
  }
);
