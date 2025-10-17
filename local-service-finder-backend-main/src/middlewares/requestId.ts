import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
export const attachRequestId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).id = uuidv4();
  next();
};
