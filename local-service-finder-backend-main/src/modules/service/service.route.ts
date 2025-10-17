// service.route.ts
import { Router } from 'express';
import { authMiddleware } from '@src/middlewares/auth';
import validateRequest from '@src/middlewares/validateRequest';
import * as serviceController from './service.controller';
import { createCategoryValidationSchema, createCertificationValidationSchema, createPackageValidationSchema, createPortfolioValidationSchema, createReviewValidationSchema, createSubCategoryValidationSchema, updateCategoryValidationSchema, updateCertificationValidationSchema, updatePackageValidationSchema, updatePortfolioValidationSchema, updateReviewValidationSchema, updateSubCategoryValidationSchema } from './service.validation';

const router = Router();

// POST /createCategory
router.post('/createCategory', authMiddleware, validateRequest(createCategoryValidationSchema), serviceController.createCategory);

// GET /categories
router.get('/categories', serviceController.getCategories);

// GET /categories/:id
router.get('/categories/:id', serviceController.getCategoryById);

// PATCH /categories/:id
router.patch('/categories/:id', authMiddleware, validateRequest(updateCategoryValidationSchema), serviceController.updateCategory);

// DELETE /categories/:id
router.delete('/categories/:id', authMiddleware, serviceController.deleteCategory);

// =================SubCategory Routes=================
// POST /createSubCategory
router.post(
  '/createSubCategory',
  authMiddleware,
  validateRequest(createSubCategoryValidationSchema),
  serviceController.createSubCategory
);
// GET /subCategories/:categoryId
router.get('/subCategories/:categoryId', serviceController.getSubCategoriesByCategoryId);

// PATCH /updateSubCategory/:id
router.patch(
  '/updateSubCategory/:id',
  authMiddleware,
  validateRequest(updateSubCategoryValidationSchema),
  serviceController.updateSubCategory
);
// DELETE /deleteSubCategory/:id
router.delete('/deleteSubCategory/:id', authMiddleware, serviceController.deleteSubCategory);

//===============Certification Routes=================

// POST /createCertification
router.post(
  '/createCertification',
  authMiddleware,
  validateRequest(createCertificationValidationSchema),
  serviceController.createCertification
);
// GET /certifications/:userId
router.get('/certifications/:userId', serviceController.getCertificationsByUserId);

// PATCH /updateCertification/:id
router.patch(
  '/updateCertification/:id',
  authMiddleware,
  validateRequest(updateCertificationValidationSchema),
  serviceController.updateCertification
);

// DELETE /deleteCertification/:id
router.delete('/deleteCertification/:id', authMiddleware, serviceController.deleteCertification);


//===============Package Routes=================
// Create package
router.post(
  '/createPackage',
  authMiddleware,
  validateRequest(createPackageValidationSchema),
  serviceController.createPackage
);

// Get all packages
// router.get('/packages', serviceController.getPackagesByUserId);

// Get package by ID
// router.get('/packages/:id', serviceController.getPackagesByUserId);

// Get package by user ID
router.get('/packages/:userId', serviceController.getPackagesByUserId);

// Update package by ID
router.patch(
  '/updatePackage/:id',
  authMiddleware,
  validateRequest(updatePackageValidationSchema),
  serviceController.updatePackage
);

// Delete package by ID
router.delete('/deletePackage/:id', authMiddleware, serviceController.deletePackage);

//============================================ Portfolio Routes ================================
router.post(
  '/portfolioCreate',
  authMiddleware,
  validateRequest(createPortfolioValidationSchema),
  serviceController.createPortfolio
);

router.patch(
  '/updatePortfolio/:id',
  authMiddleware,
  validateRequest(updatePortfolioValidationSchema),
  serviceController.updatePortfolio
);
// Get portfolio by user ID
router.get('/portfolios/:userId', serviceController.getPortfoliosByUserId);

// Delete portfolio by ID
router.delete('/deletePortfolio/:id', authMiddleware, serviceController.deletePortfolio);


// ====Review router===

router.post(
  '/createReview',
  authMiddleware,
  validateRequest(createReviewValidationSchema),
  serviceController.createReview
);
router.patch(
  '/updateReview/:id',
  authMiddleware,
  validateRequest(updateReviewValidationSchema),
  serviceController.updateReview
);

router.get('/reviews/:userId', serviceController.getReviewsByUserId);


router.patch


const serviceRoute = router;

export default serviceRoute;
