import {
  jwtAccessTokenExpiry,
  jwtAccessTokenSecret,
  jwtRefreshTokenExpiry,
  jwtRefreshTokenSecret,
} from '@src/config';
import { CustomJwtPayload } from '@src/types/custom-jwt';
import logger from '@src/utils/logger';
import jwt, { SignOptions } from 'jsonwebtoken';

type TokenPayload = {
  userId: number;
  role?: string;
};

/**
 * Generates a signed JWT access token using the provided payload.
 *
 * @param payload - The payload to include in the JWT token.
 * @returns The signed JWT access token as a string.
 */
export const generateAccessToken = (
  payload: TokenPayload,
  options = {
    expiresIn: jwtAccessTokenExpiry,
  } as SignOptions,
): string => {
  return jwt.sign(payload, jwtAccessTokenSecret, options);
};

/**
 * Generates a signed JWT refresh token using the provided payload.
 *
 * @param payload - The payload to include in the JWT refresh token.
 * @returns The signed JWT refresh token as a string.
 */
export const generateRefreshToken = (
  payload: TokenPayload,
  options = {
    expiresIn: jwtRefreshTokenExpiry,
  } as SignOptions,
): string => {
  return jwt.sign(payload, jwtRefreshTokenSecret, options);
};

/**
 * Verifies a JWT access token and returns the decoded payload if valid.
 *
 * @param token - The JWT access token to verify.
 * @returns The decoded payload as a `CustomJwtPayload` if verification succeeds, or `null` if verification fails.
 *
 * @remarks
 * This function uses the `jwtAccessTokenSecret` to verify the token.
 * If the token is invalid or an error occurs during verification, `null` is returned and a warning is logged.
 */
export const verifyAccessToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, jwtAccessTokenSecret);

    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as CustomJwtPayload;
    }

    return null;
  } catch (error) {
    logger.warn(error);
    return null;
  }
};

/**
 * Verifies a refresh JWT token and returns the decoded payload if valid.
 *
 * @param token - The JWT refresh token to verify.
 * @returns The decoded payload as a `CustomJwtPayload` if verification succeeds, or `null` if verification fails.
 *
 * @remarks
 * This function uses the `jwtRefreshTokenSecret` to verify the token.
 * If the token is invalid or an error occurs during verification, `null` is returned and a warning is logged.
 */
export const verifyRefreshToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, jwtRefreshTokenSecret);

    if (typeof decoded === 'object' && decoded !== null) {
      return decoded as CustomJwtPayload;
    }

    return null;
  } catch (error) {
    logger.warn(error);
    return null;
  }
};
