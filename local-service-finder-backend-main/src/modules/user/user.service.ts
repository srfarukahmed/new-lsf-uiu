import { HttpStatus } from '@src/constants/httpStatus';
import db from '@src/database/models';
import {
  TCreateUserInput,
  TUpdateUserInput,
  TUser,
} from '@src/database/models/User.model';
import { ApiError } from '@src/utils/ApiError';
import { passwordHash } from '@src/utils/hashing';
import logger from '@src/utils/logger';

/**
 * Creates a new user with the provided input data.
 * Hashes the user's password before saving to the database.
 * Returns the created user object without the password field.
 *
 * @param input - The user data required to create a new user.
 * @returns A promise that resolves to the created user object, excluding the password.
 */
export const createUser = async (
  input: TCreateUserInput,
): Promise<Omit<TUser, 'password'>> => {
  input.password = await passwordHash(input.password);
  logger.info('====Request data: ', input);
  if (input && input.email) {
    const existingUser = await db.User.findOne({
      where: { email: input.email.trim() },
    });
    if (existingUser) {
      throw new ApiError('Email already exists', HttpStatus.BAD_REQUEST);
    }
  }
  const user = await db.User.create(input);

  if (!user) {
    throw new ApiError(
      'User creation failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = user.dataValues;
  return userWithoutPassword;
};

/**
 * Retrieves a user by their unique identifier, excluding the password field from the result.
 *
 * @param userId - The unique identifier of the user to retrieve.
 * @returns A promise that resolves to the user object without the password field, or null if the user is not found.
 */
export const getUserById = async (
  userId: number,
): Promise<Omit<TUser, 'password'> & {
  packages?: any[],
  portfolios?: any[],
  certifications?: any[],
  requestModifications?: any[],
  serviceRequestsAsProvider?: any[],
  category?: any,
  receivedReviews?: any[],
  total_rating_count?: number,
  avg_rating?: number,
  repeatClients?: number,
  jobsCompleted?: number,
  responseTime?: string | null,
  onTimeRate?: string | null,
  ongoingServices?: any[],
} | null> => {
  const user = await db.User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [
      { model: db.Package, as: 'packages' },
      { model: db.Portfolio, as: 'portfolios' },
      { model: db.Certification, as: 'certifications' },
      { model: db.RequestModification, as: 'requestModifications' },
      { model: db.ServiceRequest, as: 'serviceRequestsAsProvider' },
      {
        model: db.ServiceRequest, as: 'serviceRequestsAsCustomer',
        include: [
          // Include the package details
          {
            model: db.Package,
            as: 'package',
            attributes: ['id', 'name', 'description', 'price', 'userId'],
          },
          // Include the provider basic info
          {
            model: db.User,
            as: 'serviceProvider', // make sure alias matches your association
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          },
        ],


      },
      {
        model: db.Category,
        as: 'category',
        include: [{ model: db.SubCategory, as: 'subCategories' }],
      },
      {
        model: db.Review,
        as: 'receivedReviews',
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          }
        ],
      },
    ],
  });

  if (!user) return null;

  const plainUser = user.get({ plain: true });

  // Reviews metrics
  const reviews = plainUser.receivedReviews || [];
  const total_rating_count = reviews.length;
  const avg_rating =
    total_rating_count > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total_rating_count
      : 0;

  // Service requests metrics
  const serviceRequests = plainUser.serviceRequestsAsProvider || [];

  // Jobs completed
  const jobsCompleted = serviceRequests.filter((r: any) => r.status === 'COMPLETED').length;

  // Repeat clients
  const userBookingCount: Record<number, number> = {};
  serviceRequests.forEach((r: any) => {
    userBookingCount[r.userId] = (userBookingCount[r.userId] || 0) + 1;
  });
  const repeatClients = Object.values(userBookingCount).filter(count => count > 1).length;

  // Response time
  const respondedRequests = serviceRequests.filter((r: any) => r.status !== 'PENDING');
  const responseTimes = respondedRequests.map((r: any) => {
    const created = new Date(r.createdAt).getTime();
    const updated = new Date(r.updatedAt).getTime();
    return (updated - created) / 1000 / 3600; // hours
  });
  const responseTime =
    responseTimes.length > 0
      ? `${(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length).toFixed(1)} hours`
      : 'N/A'; // or "0 hours" or "Not responded yet"

  // On-time rate
  const onTimeCount = serviceRequests.filter((r: any) => {
    if (r.status !== 'COMPLETED') return false;
    const completedAt = new Date(r.updatedAt);
    const preferred = new Date(`${r.preferredDate}T${r.preferredTime}`);
    return completedAt <= preferred;
  }).length;
  const onTimeRate = serviceRequests.length > 0 ? `${((onTimeCount / serviceRequests.length) * 100).toFixed(0)}%` : null;

  // Ongoing services: PENDING or APPROVED
  const ongoingServicesCount = serviceRequests.filter(
    (r: any) => r.status === 'PENDING' || r.status === 'APPROVED'
  ).length;
  return {
    ...plainUser,
    total_rating_count,
    avg_rating: Number(avg_rating.toFixed(1)),
    repeatClients,
    jobsCompleted,
    responseTime,
    onTimeRate,
    ongoingServicesCount,
  };
};



/**
 * Retrieves a user by their email address, excluding the password field from the result.
 *
 * @param email - The email address of the user to retrieve.
 * @returns A promise that resolves to the user object without the password field, or null if no user is found.
 */
export const getUserByEmail = async (
  email: string,
): Promise<Omit<TUser, 'password'> | null> => {
  const user = await db.User.findOne({ where: { email: email.trim() } });
  return user ? user.dataValues : null;
};

export const updateUser = async (
  userId: number,
  input: TUpdateUserInput,
): Promise<Omit<TUser, 'password'> | null> => {
  if (input.password) {
    input.password = await passwordHash(input.password);
  }

  if (input && input.email) {
    const findUser = await db.User.findOne({
      where: { email: input.email.trim() },
    });
    const existingUser = findUser?.dataValues;
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError('Email already exists', HttpStatus.BAD_REQUEST);
    }
  }

  const user = await db.User.update(input, {
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError('User not found', HttpStatus.NOT_FOUND);
  }

  const findUser = await getUserById(userId);

  return findUser;
};



export const getTopRatedProviders = async (
  limit: number = 10, // number of providers to return
): Promise<(Omit<TUser, 'password'> & {
  packages?: any[],
  portfolios?: any[],
  certifications?: any[],
  requestModifications?: any[],
  serviceRequestsAsProvider?: any[],
  category?: any,
  receivedReviews?: any[],
  total_rating_count?: number,
  avg_rating?: number,
  repeatClients?: number,
  jobsCompleted?: number,
  responseTime?: string | null,
  onTimeRate?: string | null,
  ongoingServicesCount?: number,
})[]> => {

  // Fetch all providers with their reviews and other associations
  const providers = await db.User.findAll({
    where: { role: 'PROVIDER' },
    attributes: { exclude: ['password'] },
    include: [
      { model: db.Package, as: 'packages' },
      { model: db.Portfolio, as: 'portfolios' },
      { model: db.Certification, as: 'certifications' },
      { model: db.RequestModification, as: 'requestModifications' },
      { model: db.ServiceRequest, as: 'serviceRequestsAsProvider' },
      {
        model: db.Category,
        as: 'category',
        include: [{ model: db.SubCategory, as: 'subCategories' }],
      },
      {
        model: db.Review,
        as: 'receivedReviews',
        include: [
          { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }
        ],
      },
    ],
  });

  // Map each provider and calculate metrics
  const providerList = providers.map((provider: any) => {
    const p = provider.get({ plain: true });

    const reviews = p.receivedReviews || [];
    const total_rating_count = reviews.length;
    const avg_rating = total_rating_count > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total_rating_count
      : 0;

    const serviceRequests = p.serviceRequestsAsProvider || [];
    const jobsCompleted = serviceRequests.filter((r: any) => r.status === 'COMPLETED').length;

    const userBookingCount: Record<number, number> = {};
    serviceRequests.forEach((r: any) => {
      userBookingCount[r.userId] = (userBookingCount[r.userId] || 0) + 1;
    });
    const repeatClients = Object.values(userBookingCount).filter(c => c > 1).length;

    const respondedRequests = serviceRequests.filter((r: any) => r.status !== 'PENDING');
    const responseTimes = respondedRequests.map((r: any) => {
      const created = new Date(r.createdAt).getTime();
      const updated = new Date(r.updatedAt).getTime();
      return (updated - created) / 1000 / 3600; // hours
    });
    const responseTime =
      responseTimes.length > 0
        ? `${(responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length).toFixed(1)} hours`
        : 'N/A';

    const onTimeCount = serviceRequests.filter((r: any) => {
      if (r.status !== 'COMPLETED') return false;
      const completedAt = new Date(r.updatedAt);
      const preferred = new Date(`${r.preferredDate}T${r.preferredTime}`);
      return completedAt <= preferred;
    }).length;
    const onTimeRate = serviceRequests.length > 0 ? `${((onTimeCount / serviceRequests.length) * 100).toFixed(0)}%` : 'N/A';

    const ongoingServicesCount = serviceRequests.filter(
      (r: any) => r.status === 'PENDING' || r.status === 'APPROVED'
    ).length;

    return {
      ...p,
      total_rating_count,
      avg_rating: Number(avg_rating.toFixed(1)),
      repeatClients,
      jobsCompleted,
      responseTime,
      onTimeRate,
      ongoingServicesCount,
    };
  });

  // Sort by avg_rating descending and limit
  providerList.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));

  return providerList.slice(0, limit);
};
