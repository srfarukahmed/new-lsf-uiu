import { NODE_ENV } from '@src/config';
import fs from 'fs';
import path from 'path';
import { createLogger, format, Logger, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, errors, splat, json, colorize, printf } = format;

const isProduction = NODE_ENV === 'production';

const logDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger: Logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    splat(),
    json(),
  ),
  defaultMeta: { service: 'expense-tracker-backend' },
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
      ),
    }),
  ],
});

export default logger;
