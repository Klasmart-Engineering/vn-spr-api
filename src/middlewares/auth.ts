import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

export const checkToken = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const token = req.get('Authorization');

  // TODO: check token's validity, using https://github.com/KL-Engineering/kidsloop-token-validation

  if (!token) {
    throw createError(401, { message: 'Unauthorized.' });
  }

  next();
};
