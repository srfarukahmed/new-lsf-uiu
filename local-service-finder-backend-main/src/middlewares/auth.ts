import { HttpStatus } from '@src/constants/httpStatus';
import { ApiError } from '@src/utils/ApiError';
import { verifyAccessToken } from '@src/utils/jwt';
import { NextFunction, Request, Response } from 'express';
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(
      'Unauthorized: No token provided',
      HttpStatus.UNAUTHORIZED,
    );
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    throw new ApiError(
      'Unauthorized: Invalid token or expired token',
      HttpStatus.UNAUTHORIZED,
    );
  }
  req.user = decoded;
  next();
};
