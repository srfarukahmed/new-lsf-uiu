import logger from '@src/utils/logger';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure req.body is at least an object
      await schema.parseAsync(req.body ?? {});
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // Format Zod errors nicely
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      // Pass other errors to the next middleware
      next(err);
    }
  };
};

export default validateRequest;
