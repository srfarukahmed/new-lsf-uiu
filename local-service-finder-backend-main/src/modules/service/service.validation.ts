// service.validation.ts
import { z } from 'zod';

/**
 * Validation schema for creating a new category
 */
export const createCategoryValidationSchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(255, 'Category name cannot exceed 255 characters'),
  icon: z
    .string()
    .min(2, 'Icon must be at least 2 characters long')
    .max(255, 'Icon cannot exceed 255 characters'),
});

/**
 * Validation schema for updating an existing category
 * Only allows optional fields for partial update
 */
export const updateCategoryValidationSchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters long')
    .max(255, 'Category name cannot exceed 255 characters')
    .optional(),
  icon: z
    .string()
    .min(2, 'Icon must be at least 2 characters long')
    .max(255, 'Icon cannot exceed 255 characters')
    .optional(),
});


export const createPackageValidationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  userId: z.number().int('User ID must be a number'),
});

export const updatePackageValidationSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.string().optional(),
  userId: z.number().int().optional(),
});



// ✅ Create Portfolio Validation
export const createPortfolioValidationSchema = z.object({
  userId: z.number().int(),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  startDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Start date must be a valid date (YYYY-MM-DD)'
  ),
  endDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'End date must be a valid date (YYYY-MM-DD)'
  ),
  attachments: z.array(z.string()).optional(), // optional array of file names
});

// ✅ Update Portfolio Validation
export const updatePortfolioValidationSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Start date must be valid')
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'End date must be valid')
    .optional(),
  attachments: z.array(z.string()).optional(),
});



// ✅ Create Certification Validation
export const createCertificationValidationSchema = z.object({
  userId: z.number().int('User ID must be a number'),
  title: z.string().min(2, 'Title must be at least 2 characters long'),
  issuer: z.string().min(2, 'Issuer must be at least 2 characters long'),
  earnedOn: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Earned On date must be a valid date (YYYY-MM-DD)'
  ),
  expiresOn: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Expires On date must be valid (YYYY-MM-DD)')
    .optional(),
});

// ✅ Update Certification Validation
export const updateCertificationValidationSchema = z.object({
  title: z.string().min(2).optional(),
  issuer: z.string().min(2).optional(),
  earnedOn: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Earned On date must be valid')
    .optional(),
  expiresOn: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Expires On date must be valid')
    .optional(),
});


// ✅ Create SubCategory Validation
export const createSubCategoryValidationSchema = z.object({
  categoryId: z.number().int('Category ID must be a number'),
  name: z.string().min(2, 'SubCategory name must be at least 2 characters').max(255),
});

// ✅ Update SubCategory Validation
export const updateSubCategoryValidationSchema = z.object({
  categoryId: z.number().int().optional(),
  name: z.string().min(2).max(255).optional(),
});


export const createReviewValidationSchema = z.object({
  userId: z.number().int(),
  providerId: z.number().int(),
  serviceRequestId: z.number().int(),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(2).max(1000).optional(),
});

export const updateReviewValidationSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(2).max(1000).optional(),
});