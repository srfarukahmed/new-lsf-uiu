import { NODE_ENV } from '@src/config';
import { Request } from 'express';
import morgan, { StreamOptions } from 'morgan';
import logger from './logger';

// Create custom stream for Winston
const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Add request ID to logs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
morgan.token('id', (req: Request) => (req as any).id || 'anonymous');

// Define log format
const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms :id';
// HTTP logging middleware
const httpLogger = morgan(morganFormat, {
  stream,
  skip: () => NODE_ENV === 'development',
});

export default httpLogger;
