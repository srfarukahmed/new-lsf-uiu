import { HttpStatus } from '@src/constants/httpStatus';
import { GenericResponse } from '@src/types/response';
import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  message: string,
  statusCode = HttpStatus.OK,
  data?: T,
) {
  const payload: GenericResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
}
