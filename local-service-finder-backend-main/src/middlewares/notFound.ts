import { HttpStatus } from '@src/constants/httpStatus';
import { ApiError } from '@src/utils/ApiError';
import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(
    new ApiError(`Route ${req.originalUrl} not found`, HttpStatus.NOT_FOUND),
  );
};
