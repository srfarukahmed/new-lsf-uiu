/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpStatus } from '@src/constants/httpStatus';
import { ErrorResponse } from '@src/types/response';
import { ApiError } from '@src/utils/ApiError';
import logger from '@src/utils/logger';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

/**
 * Global error handling middleware for Express.
 * Handles various error types (Zod, Mongoose, custom ApiError, etc.)
 * and sends a standardized error response.
 *
 * @param err - The error object thrown in the application
 * @param req - Express request object
 * @param res - Express response object
 * @param _ - Express next function (unused)
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction,
) => {
  // Default error response values
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errors = err.issues;
  }
  // Handle Mongoose CastError (invalid ObjectId, etc.)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Handle Mongoose ValidationError (schema validation)
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }
  // Handle Mongoose duplicate key error (code 11000)
  else if ((err as any).code === 11000) {
    statusCode = HttpStatus.CONFLICT;
    const field = Object.keys((err as any).keyValue)[0];
    message = `Duplicate field value: '${field}'`;
  }
  // Handle custom ApiError
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log the error details for debugging
  logger.error(
    `${req.method} ${req.originalUrl} - ${statusCode} - ${message}`,
    err,
  );

  // Build the error response payload
  const errorPayload: ErrorResponse = {
    success: false,
    message,
  };

  // Attach validation or other error details if present
  if (errors) errorPayload.errors = errors;

  // Include stack trace in development mode for easier debugging
  if (process.env.NODE_ENV === 'development') errorPayload.stack = err.stack;

  // Send the error response
  res.status(statusCode).json(errorPayload);
};
