import { HttpStatus } from '@src/constants/httpStatus';
import { CustomJwtPayload } from '@src/types/custom-jwt';
import { ApiError } from '@src/utils/ApiError';
import { catchAsync } from '@src/utils/catchAsync';
import { generateAccessToken, verifyRefreshToken } from '@src/utils/jwt';
import { sendSuccess } from '@src/utils/sendResponse';
import { cookieOptions } from './auth.constant';
import * as authService from './auth.service';
import logger from '@src/utils/logger';

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;


  const result = await authService.loginUser(email, password);
  res.cookie('refreshToken', result.refreshToken, {
    ...cookieOptions,
    sameSite: 'lax',
  });
  sendSuccess(res, 'User is logged in successfully', HttpStatus.OK, result);
});

export const refreshAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError('No refresh token provided', HttpStatus.BAD_REQUEST);
  }
  const decoded = verifyRefreshToken(refreshToken) as CustomJwtPayload;
  const newAccessToken = generateAccessToken({
    userId: decoded.userId as number,
  });
  sendSuccess(res, 'Access token refreshed successfully', HttpStatus.OK, {
    accessToken: newAccessToken,
  });
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken', { ...cookieOptions, sameSite: 'strict' });
  sendSuccess(res, 'User logged out successfully', HttpStatus.OK);
});
