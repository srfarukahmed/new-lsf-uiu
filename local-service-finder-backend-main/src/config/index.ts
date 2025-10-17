import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || '3000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const HOST = process.env.HOST || '127.0.0.1';
export const DB_PASS = process.env.DB_PASS || '';
export const DB_USER = process.env.DB_NAME || 'root';
export const DB_NAME = process.env.DB_NAME || 'tabletec_finder';
export const DB_PORT = process.env.DB_PORT || 3306;
export const hashingSalt = process.env.HASHING_SALT as string;
export const jwtAccessTokenSecret = process.env
  .JWT_ACCESS_TOKEN_SECRET as string;
export const jwtRefreshTokenSecret = process.env
  .JWT_REFRESH_TOKEN_SECRET as string;
export const jwtAccessTokenExpiry =
  process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m';
export const jwtRefreshTokenExpiry =
  process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d';
