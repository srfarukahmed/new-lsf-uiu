import { HttpStatus } from '@src/constants/httpStatus';
import { ApiError } from '@src/utils/ApiError';
import { catchAsync } from '@src/utils/catchAsync';
import { sendSuccess } from '@src/utils/sendResponse';
import * as userService from './user.service';
import { TUser } from '@src/database/models/User.model';
import { log } from 'console';

/**
 * Handles the creation of a new user.
 *
 * @param req - Express request object containing user data in the body.
 * @param res - Express response object used to send the response.
 * @returns A Promise that resolves when the user is created and a success response is sent.
 *
 * @remarks
 * This controller uses the `userService.createUser` method to create a new user
 * and sends a standardized success response using `sendSuccess`.
 * Errors are handled by the `catchAsync` utility.
 */
export const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  sendSuccess(res, 'User is created successfully', HttpStatus.CREATED, result);
});

/**
 * Handles the retrieval of the authenticated user's profile.
 *
 * This controller function extracts the user ID from the request object,
 * validates its presence, and fetches the corresponding user profile using the user service.
 * It sends an appropriate HTTP response based on whether the user ID is provided
 * and whether the user exists in the database.
 *
 * @function
 * @async
 * @param req - Express request object, expected to have `user.userId` property.
 * @param res - Express response object used to send the response.
 * @returns {Promise<void>} Sends a JSON response with user profile data or an error message.
 *
 * @throws Will not throw; errors are handled by `catchAsync`.
 */
export const getUserProfile = catchAsync(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError('User ID is required', HttpStatus.BAD_REQUEST);
  }
  const result = await userService.getUserById(req.user?.userId);
  if (!result) {
    throw new ApiError('User not found', HttpStatus.NOT_FOUND);
  }
  sendSuccess(
    res,
    'User profile retrieved successfully',
    HttpStatus.OK,
    result,
  );
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError('User ID is required', HttpStatus.BAD_REQUEST);
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError('No data provided for update', HttpStatus.BAD_REQUEST);
  }

  // Map incoming body fields to your model fields
  const updateData: Partial<TUser> = {
    firstName: req.body.firstName ?? req.body.first_name,
    lastName: req.body.lastName ?? req.body.last_name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    address: req.body.address,
    about: req.body.about,
  };

  // Remove undefined fields so they don’t overwrite existing data
  Object.keys(updateData).forEach(
    (key) => updateData[key as keyof TUser] === undefined && delete updateData[key as keyof TUser]
  );

  const result = await userService.updateUser(userId, updateData);

  sendSuccess(res, 'User profile updated successfully', HttpStatus.OK, result);
});

/**
 * Handles retrieval of a user by their ID.
 *
 * @param req - Express request object with user ID in params.
 * @param res - Express response object.
 * @returns A Promise that resolves when the user is retrieved and a success response is sent.
 */
export const getUserByUserId = catchAsync(async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    throw new ApiError('Invalid user ID', HttpStatus.BAD_REQUEST);
  }

  const result = await userService.getUserById(userId);
  if (!result) {
    throw new ApiError('User not found', HttpStatus.NOT_FOUND);
  }

  sendSuccess(res, 'User retrieved successfully', HttpStatus.OK, result);
});

// Top rated providers
export const getTopRatedProviders = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
  log(`Fetching top rated providers with limit: ${limit}`);
  if (isNaN(limit) || limit <= 0) {
    throw new ApiError('Invalid limit value', HttpStatus.BAD_REQUEST);
  }

  const result = await userService.getTopRatedProviders(limit);
  sendSuccess(res, 'Top rated providers retrieved successfully', HttpStatus.OK, result);
});





// export const updateUserPassword = catchAsync(async (req, res) => {
//   const userId = req.user?.userId;
//   const { currentPassword, newPassword } = req.body;
//   if (!currentPassword || !newPassword) {
//     throw new ApiError(
//       'Current and new passwords are required',
//       HttpStatus.BAD_REQUEST,
//     );
//   }
//   if (!userId) {
//     throw new ApiError('User ID is required', HttpStatus.BAD_REQUEST);
//   }

//   const result = await userService.changePassword(
//     userId,
//     currentPassword,
//     newPassword,
//   );

//   res.clearCookie('refreshToken', { ...cookieOptions, sameSite: 'strict' });

//   sendSuccess(res, 'User password updated successfully', HttpStatus.OK, result);
// });
