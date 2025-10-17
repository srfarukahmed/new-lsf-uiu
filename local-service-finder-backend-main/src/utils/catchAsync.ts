// src/utils/catchAsync.ts
import { NextFunction, Request, RequestHandler, Response } from 'express';

export const catchAsync =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
