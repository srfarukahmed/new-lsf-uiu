import { HttpStatus } from '@src/constants/httpStatus';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;

    // Maintain proper stack trace for where error was thrown (only on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}
