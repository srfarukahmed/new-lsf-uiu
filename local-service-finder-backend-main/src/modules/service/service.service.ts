// service.service.ts
import { HttpStatus } from '@src/constants/httpStatus';
import db from '@src/database/models';
import { ApiError } from '@src/utils/ApiError';
import logger from '@src/utils/logger';
import { TCreateCategoryInput, TUpdateCategoryInput } from '@src/database/models/category.model';
import { TCreatePackageInput, TUpdatePackageInput } from '@src/database/models/package.model';
import { TCreatePortfolioInput, TUpdatePortfolioInput } from '@src/database/models/portfolio.model';
import { TCreateCertificationInput, TUpdateCertificationInput } from '@src/database/models/certification.model';
import { TCreateSubCategoryInput, TUpdateSubCategoryInput } from '@src/database/models/sub_category.model';
import { TCreateReviewInput, TUpdateReviewInput } from '@src/database/models/review.model';

/**
 * Create a new category
 * 
 * @param input - The category data to create
 * @returns The created category instance
 * @throws ApiError if creation fails or required fields are missing
 */
export const createCategory = async (input: TCreateCategoryInput) => {
  if (!input.name || !input.icon) {
    throw new ApiError('Name and icon are required', HttpStatus.BAD_REQUEST);
  }

  try {
    logger.info(`Creating category: ${input.name}`);
    const category = await db.Category.create(input);
    return category;
  } catch (error) {
    logger.error('Failed to create category', error);
    throw new ApiError('Category creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update an existing category
 * 
 * @param categoryId - The ID of the category to update
 * @param input - The fields to update
 * @returns The updated category instance
 * @throws ApiError if category not found or update fails
 */
export const updateCategory = async (categoryId: number, input: TUpdateCategoryInput) => {
  try {
    logger.info(`Updating category ID: ${categoryId}`);
    const category = await db.Category.findByPk(categoryId);

    if (!category) {
      throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
    }

    await category.update(input);
    return category;
  } catch (error) {
    logger.error(`Failed to update category ID: ${categoryId}`, error);
    throw new ApiError('Category update failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};


/**
 * Fetch all categories from the database
 * 
 * @returns Promise resolving to an array of category instances
 */
export const getAllCategories = async () => {
  try {
    logger.info('Fetching all categories');
    // Include associated subcategories
    const categories = await db.Category.findAll({
      include: [{ model: db.SubCategory, as: 'subCategories' }],
    });
    logger.info(`Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    logger.error('Failed to fetch categories', error);
    throw new ApiError('Failed to fetch categories', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Fetch a single category by its ID
 * 
 * @param id - The ID of the category to fetch
 * @returns Promise resolving to the category instance or null if not found
 * @throws ApiError if database query fails
 */
export const getCategoryById = async (id: number) => {
  try {
    logger.info(`Fetching category with ID: ${id}`);
    const category = await db.Category.findByPk(id);

    if (!category) {
      logger.warn(`Category not found with ID: ${id}`);
      return null; // Controller can handle the 404 response
    }

    logger.info(`Category found with ID: ${id}`);
    return category;
  } catch (error) {
    logger.error(`Failed to fetch category with ID: ${id}`, error);
    throw new ApiError('Failed to fetch category', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete a category by its ID
 * 
 * @param id - The ID of the category to delete
 * @returns Promise resolving to void
 * @throws ApiError if category not found or deletion fails
 */
export const deleteCategory = async (id: number) => {
  try {
    logger.info(`Deleting category with ID: ${id}`);
    const category = await db.Category.findByPk(id);

    if (!category) {
      logger.warn(`Category not found with ID: ${id}`);
      throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
    }

    await category.destroy();
    logger.info(`Category deleted with ID: ${id}`);
  } catch (error) {
    logger.error(`Failed to delete category with ID: ${id}`, error);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Failed to delete category', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};


///================Package Services=================
export const createPackage = async (data: TCreatePackageInput) => {
  const { name, price, userId } = data;

  // Check user exists
  const user = await db.User.findByPk(userId);
  if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

  // Check package count
  const packageCount = await db.Package.count({ where: { userId } });
  if (packageCount >= 5) {
    throw new ApiError('Maximum 5 packages allowed per user', HttpStatus.BAD_REQUEST);
  }

  // Check for same package name
  const nameExists = await db.Package.findOne({ where: { userId, name } });
  if (nameExists) {
    throw new ApiError('You already have a package with this name', HttpStatus.BAD_REQUEST);
  }

  // Check for same price
  const priceExists = await db.Package.findOne({ where: { userId, price } });
  if (priceExists) {
    throw new ApiError('You already have a package with this price', HttpStatus.BAD_REQUEST);
  }

  const packageItem = await db.Package.create(data);
  return packageItem;
};

// Update package
export const updatePackage = async (id: number, data: Partial<TCreatePackageInput>) => {
  const packageItem = await db.Package.findByPk(id);
  if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);

  // Rule: package can only be updated once every 7 days
  const updatedAt = packageItem.get('updatedAt') as Date | undefined;
  if (updatedAt) {
    const lastUpdate = new Date(updatedAt);
    const now = new Date();
    const diffDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 7) {
      throw new ApiError('Package can only be updated once every 7 days', HttpStatus.BAD_REQUEST);
    }
  }

  await packageItem.update(data);
  return packageItem;
};

// Delete package
export const deletePackage = async (id: number) => {
  const packageItem = await db.Package.findByPk(id);
  if (!packageItem) throw new ApiError('Package not found', HttpStatus.NOT_FOUND);

  await packageItem.destroy();
};

// Get packages by userId
export const getPackagesByUserId = async (userId: number) => {
  const user = await db.User.findByPk(userId);
  if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

  const packages = await db.Package.findAll({ where: { userId } });
  return packages;
};

// portfolio for service provider


// Create Portfolio with attachments
export const createPortfolio = async (data: TCreatePortfolioInput, attachments?: string[]) => {
  const { userId, title, description, startDate, endDate } = data;

  // ✅ Ensure user exists
  const user = await db.User.findByPk(userId);
  if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

  // ✅ Create portfolio
  const portfolio = await db.Portfolio.create({ userId, title, description, startDate, endDate });

  // ✅ If attachments provided
  if (attachments && attachments.length > 0) {
    const attachmentData = attachments.map(fileName => ({
      fileName,
      portfolioId: portfolio.get('id'),
    }));
    await db.PortfolioAttachment.bulkCreate(attachmentData);
  }

  return portfolio;
};

// Update Portfolio
export const updatePortfolio = async (id: number, data: TUpdatePortfolioInput) => {
  const portfolio = await db.Portfolio.findByPk(id);
  if (!portfolio) throw new ApiError('Portfolio not found', HttpStatus.NOT_FOUND);

  await portfolio.update(data);
  return portfolio;
};

// Delete Portfolio (cascade deletes attachments)
export const deletePortfolio = async (id: number) => {
  const portfolio = await db.Portfolio.findByPk(id);
  if (!portfolio) throw new ApiError('Portfolio not found', HttpStatus.NOT_FOUND);

  await portfolio.destroy();
};

// Get portfolios by userId (include attachments)
export const getPortfoliosByUserId = async (userId: number) => {
  const user = await db.User.findByPk(userId);
  if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

  const portfolios = await db.Portfolio.findAll({
    where: { userId },
    include: [{ model: db.PortfolioAttachment, as: 'attachments' }],
    order: [['createdAt', 'DESC']],
  });

  return portfolios;
};

//===============certifications=================

// Create Certification
/**
 * Create a new certification for a user
 * @param payload - Certification data
 * @returns Created certification
 */
export const createCertification = async (payload: TCreateCertificationInput) => {
  const { userId, title, issuer, earnedOn, expiresOn } = payload;

  // Check if user exists
  const user = await db.User.findByPk(userId);
  if (!user) throw new ApiError('User not found', HttpStatus.NOT_FOUND);

  // Check for duplicate certification title for the same user
  const existing = await db.Certification.findOne({ where: { userId, title } });
  if (existing) {
    throw new ApiError('You already added this certification', HttpStatus.BAD_REQUEST);
  }

  const certification = await db.Certification.create({
    userId,
    title,
    issuer,
    earnedOn,
    expiresOn: expiresOn || null,
  });

  return certification;
};

/**
 * Update a certification by ID
 * @param id - Certification ID
 * @param payload - Fields to update
 * @returns Updated certification
 */
export const updateCertification = async (id: number, payload: TUpdateCertificationInput) => {
  const certification = await db.Certification.findByPk(id);
  if (!certification) throw new ApiError('Certification not found', HttpStatus.NOT_FOUND);

  await certification.update(payload);
  return certification;
};

/**
 * Delete a certification by ID
 * @param id - Certification ID
 */
export const deleteCertification = async (id: number) => {
  const certification = await db.Certification.findByPk(id);
  if (!certification) throw new ApiError('Certification not found', HttpStatus.NOT_FOUND);

  await certification.destroy();
  return { message: 'Certification deleted successfully' };
};

/**
 * Get certifications by user ID
 * @param userId - User ID
 * @returns Certifications array
 */
export const getCertificationsByUserId = async (userId: number) => {
  const certifications = await db.Certification.findAll({ where: { userId } });
  return certifications;
};


// =========Subcategory Services========
// ✅ Create SubCategory
export const createSubCategory = async (payload: TCreateSubCategoryInput) => {
  const category = await db.Category.findByPk(payload.categoryId);
  if (!category) {
    throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
  }

  const subCategory = await db.SubCategory.create(payload);
  return subCategory;
};

// ✅ Update SubCategory
export const updateSubCategory = async (id: number, payload: TUpdateSubCategoryInput) => {
  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw new ApiError('SubCategory not found', HttpStatus.NOT_FOUND);
  }

  await subCategory.update(payload);
  return subCategory;
};

// ✅ Delete SubCategory
export const deleteSubCategory = async (id: number) => {
  const subCategory = await db.SubCategory.findByPk(id);
  if (!subCategory) {
    throw new ApiError('SubCategory not found', HttpStatus.NOT_FOUND);
  }

  await subCategory.destroy();
  return { message: 'SubCategory deleted successfully' };
};

// ✅ Get SubCategories by Category ID
export const getSubCategoriesByCategoryId = async (categoryId: number) => {
  const subCategories = await db.SubCategory.findAll({ where: { categoryId } });
  return subCategories;
};


// =========Review Services========

/**
 * Create a new review
 */
export const createReview = async (payload: TCreateReviewInput) => {
  // Ensure the service request exists
  const serviceRequest = await db.ServiceRequest.findByPk(payload.serviceRequestId);
  if (!serviceRequest) {
    throw new ApiError('Service Request not found', HttpStatus.NOT_FOUND);
  }

  // Ensure the provider exists
  const provider = await db.User.findByPk(payload.providerId);
  if (!provider) {
    throw new ApiError('Provider not found', HttpStatus.NOT_FOUND);
  }

  const review = await db.Review.create(payload);
  return review;
};

/**
 * Get all reviews
 */
export const getAllReviews = async () => {
  return db.Review.findAll({
    include: [
      { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
      { model: db.User, as: 'provider', attributes: ['id', 'firstName', 'lastName'] },
      { model: db.ServiceRequest, as: 'serviceRequest', attributes: ['id', 'status'] },
    ],
  });
};

/**
 * Get all reviews by userId
 */
export const getReviewsByUserId = async (userId: number) => {
  return db.Review.findAll({
    where: { userId },
    include: [
      { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
      { model: db.User, as: 'provider', attributes: ['id', 'firstName', 'lastName'] },
      { model: db.ServiceRequest, as: 'serviceRequest', attributes: ['id', 'status'] },
    ],
    order: [['createdAt', 'DESC']], // newest first
  });
};

/**
 * Get review by ID
 */
export const getReviewById = async (id: number) => {
  const review = await db.Review.findByPk(id, {
    include: [
      { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
      { model: db.User, as: 'provider', attributes: ['id', 'firstName', 'lastName'] },
      { model: db.ServiceRequest, as: 'serviceRequest', attributes: ['id', 'status'] },
    ],
  });

  if (!review) throw new ApiError('Review not found', HttpStatus.NOT_FOUND);
  return review;
};

/**
 * Update review by ID
 */
export const updateReview = async (id: number, payload: TUpdateReviewInput) => {
  const review = await db.Review.findByPk(id);
  if (!review) throw new ApiError('Review not found', HttpStatus.NOT_FOUND);

  await review.update(payload);
  return review;
};

/**
 * Delete review by ID
 */
export const deleteReview = async (id: number) => {
  const review = await db.Review.findByPk(id);
  if (!review) throw new ApiError('Review not found', HttpStatus.NOT_FOUND);

  await review.destroy();
  return true;
};
