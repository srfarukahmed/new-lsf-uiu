import { HttpStatus } from '@src/constants/httpStatus';
import db from '@src/database/models';

import { ApiError } from '@src/utils/ApiError';
import { passwordCompare } from '@src/utils/hashing';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@src/utils/jwt';
import logger from '@src/utils/logger';
import { Logger } from 'winston';

/**
 * Authenticates a user with the provided email and password.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns An object containing the accessToken and refreshToken.
 * @throws {ApiError} If email or password is missing, user is not found, or password is invalid.
 */
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ApiError(
      'Email and password are required',
      HttpStatus.BAD_REQUEST,
    );
  }
  logger.info(`Email from request body: ${email}`);
  logger.info(`Password from request body: ${password}`);

  const user = await db.User.findOne({ where: { email: email.trim() } });
  logger.info(`User found: ${user ? 'Yes' : 'No'}`);

  if (!user) {
    throw new ApiError('User not found', HttpStatus.NOT_FOUND);
  }

  const { password: userPassword, ...userWithoutPassword } = user.dataValues;
  const isPasswordCorrect = await passwordCompare(password, userPassword);
  if (!isPasswordCorrect) {
    throw new ApiError('Invalid password', HttpStatus.UNAUTHORIZED);
  }

  const payload = { userId: userWithoutPassword.id };

  const accessToken = generateAccessToken(payload);
  console.log('Generated access token: ', accessToken);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken , user: user};
};

export const getAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.userId) {
    throw new ApiError(
      'Invalid or expired refresh token',
      HttpStatus.UNAUTHORIZED,
    );
  }
  const user = await db.User.findByPk(decoded.userId);
  if (!user) {
    throw new ApiError('User not found', HttpStatus.NOT_FOUND);
  }

  const payload = { userId: user.dataValues.id };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken: newRefreshToken };
};
