// service.controller.ts
import { Request, Response } from 'express';
import { HttpStatus } from '@src/constants/httpStatus';
import { ApiError } from '@src/utils/ApiError';
import { catchAsync } from '@src/utils/catchAsync';
import { sendSuccess } from '@src/utils/sendResponse';
import logger from '@src/utils/logger';
import * as serviceService from './service.service';
import db from '@src/database/models';
import { TCreatePackageInput, TUpdatePackageInput } from '@src/database/models/package.model';

/**
 * Create a new category
 */
export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, icon } = req.body;

  const category = await serviceService.createCategory({ name, icon });
  sendSuccess(res, 'Category created successfully', HttpStatus.CREATED, category);
});

/**
 * Update an existing category
 */
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  const { name, icon } = req.body;

  const category = await serviceService.updateCategory(categoryId, { name, icon });
  sendSuccess(res, 'Category updated successfully', HttpStatus.OK, category);
});

/**
 * Get all categories
 */
export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await serviceService.getAllCategories();
  sendSuccess(res, 'Categories fetched successfully', HttpStatus.OK, categories);
});

/**
 * Get a single category by ID
 */
export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  const category = await serviceService.getCategoryById(categoryId);

  if (!category) {
    throw new ApiError('Category not found', HttpStatus.NOT_FOUND);
  }

  sendSuccess(res, 'Category fetched successfully', HttpStatus.OK, category);
});

/**
 * Delete a category
 */
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  await serviceService.deleteCategory(categoryId);
  sendSuccess(res, 'Category deleted successfully', HttpStatus.OK);
});



///================Package Controllers=================
/**
 * Create a new package with validations:
 * 1. No other package with same name for the user
 * 2. No other package with same price for the user
 * 3. Maximum 5 packages per user
 */
export const createPackage = catchAsync(async (req: Request, res: Response) => {
  const { name, description, price, userId } = req.body;

  const packageItem = await serviceService.createPackage({
    name,
    description,
    price,
    userId,
  });

  sendSuccess(res, 'Package created successfully', HttpStatus.CREATED, packageItem);
});
// Update Package
export const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, userId } = req.body;

  const packageItem = await serviceService.updatePackage(Number(id), {
    name,
    description,
    price,
    userId,
  });

  sendSuccess(res, 'Package updated successfully', HttpStatus.OK, packageItem);
});

// Delete Package
export const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await serviceService.deletePackage(Number(id));
  sendSuccess(res, 'Package deleted successfully', HttpStatus.OK,);
});

// Get Packages By User ID
export const getPackagesByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const packages = await serviceService.getPackagesByUserId(Number.parseInt(userId, 10));
  sendSuccess(res, 'Packages fetched successfully', HttpStatus.OK, packages);
});


// Create portfolio
export const createPortfolio = catchAsync(async (req: Request, res: Response) => {
  const { userId, title, description, startDate, endDate, attachments } = req.body;

  const portfolio = await serviceService.createPortfolio(
    { userId, title, description, startDate, endDate },
    attachments
  );

  sendSuccess(res, 'Portfolio created successfully', HttpStatus.CREATED, portfolio);
});

// Update portfolio
export const updatePortfolio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const portfolio = await serviceService.updatePortfolio(Number(id), req.body);

  sendSuccess(res, 'Portfolio updated successfully', HttpStatus.OK, portfolio);
});

// Delete portfolio
export const deletePortfolio = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await serviceService.deletePortfolio(Number(id));

  sendSuccess(res, 'Portfolio deleted successfully', HttpStatus.OK, null);
});

// Get portfolios by userId
export const getPortfoliosByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const portfolios = await serviceService.getPortfoliosByUserId(Number(userId));

  sendSuccess(res, 'Portfolios fetched successfully', HttpStatus.OK, portfolios);
});


//===============certifications=================
// Create Certification
/**
 * Create certification
 */
export const createCertification = catchAsync(async (req: Request, res: Response) => {
  const { userId, title, issuer, earnedOn, expiresOn } = req.body;

  const certification = await serviceService.createCertification({
    userId,
    title,
    issuer,
    earnedOn,
    expiresOn,
  });

  sendSuccess(res, 'Certification created successfully', HttpStatus.CREATED, certification);
});

/**
 * Update certification
 */
export const updateCertification = catchAsync(async (req: Request, res: Response) => {
  const certificationId = parseInt(req.params.id, 10);

  const certification = await serviceService.updateCertification(certificationId, req.body);

  sendSuccess(res, 'Certification updated successfully', HttpStatus.OK, certification);
});

/**
 * Delete certification
 */
export const deleteCertification = catchAsync(async (req: Request, res: Response) => {
  const certificationId = parseInt(req.params.id, 10);

  const result = await serviceService.deleteCertification(certificationId);

  sendSuccess(res, 'Certification deleted successfully', HttpStatus.OK, result);
});

/**
 * Get certifications by user ID
 */
export const getCertificationsByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);

  const certifications = await serviceService.getCertificationsByUserId(userId);

  sendSuccess(res, 'Certifications fetched successfully', HttpStatus.OK, certifications);
});


//================Sub Category Controllers=================
// ✅ Create SubCategory
export const createSubCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId, name } = req.body;

  const subCategory = await serviceService.createSubCategory({ categoryId, name });
  sendSuccess(res, 'SubCategory created successfully', HttpStatus.CREATED, subCategory);
});

// ✅ Update SubCategory
export const updateSubCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;

  const subCategory = await serviceService.updateSubCategory(Number(id), { name, categoryId });
  sendSuccess(res, 'SubCategory updated successfully', HttpStatus.OK, subCategory);
});

// ✅ Delete SubCategory
export const deleteSubCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await serviceService.deleteSubCategory(Number(id));
  sendSuccess(res, result.message, HttpStatus.OK);
});

// ✅ Get SubCategories by CategoryId
export const getSubCategoriesByCategoryId = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const subCategories = await serviceService.getSubCategoriesByCategoryId(Number(categoryId));
  sendSuccess(res, 'SubCategories fetched successfully', HttpStatus.OK, subCategories);
});


//================Review Controllers=================
/**
 * Create a new review
 */
export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { userId, providerId, serviceRequestId, rating, comment } = req.body;

  const review = await serviceService.createReview({
    userId,
    providerId,
    serviceRequestId,
    rating,
    comment,
  });

  sendSuccess(res, 'Review created successfully', HttpStatus.CREATED, review);
});

/**
 * Get all reviews
 */
export const getReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await serviceService.getAllReviews();
  sendSuccess(res, 'Reviews fetched successfully', HttpStatus.OK, reviews);
});

/**
 * Get review by ID
 */
export const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await serviceService.getReviewById(Number(id));
  sendSuccess(res, 'Review fetched successfully', HttpStatus.OK, review);
});

/**
 * Get review by user ID
 */
export const getReviewsByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const reviews = await serviceService.getReviewsByUserId(Number(userId));
  sendSuccess(res, 'Reviews fetched successfully', HttpStatus.OK, reviews);
})

/**
 * Update review
 */

export const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await serviceService.updateReview(Number(id), req.body);
  sendSuccess(res, 'Review updated successfully', HttpStatus.OK, review);
});

/**
 * Delete review
 */

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await serviceService.deleteReview(Number(id));
  sendSuccess(res, 'Review deleted successfully', HttpStatus.OK, null);
});
