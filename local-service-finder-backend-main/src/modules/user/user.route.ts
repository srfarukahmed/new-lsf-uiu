import { authMiddleware } from '@src/middlewares/auth';
import validateRequest from '@src/middlewares/validateRequest';
import { updateUserValidationSchema } from '@src/modules/user/user.validation';
import { Router } from 'express';
import * as userController from './user.controller';

const router = Router();

router.get('/me', authMiddleware, userController.getUserProfile);
router.patch(
  '/profile',
  authMiddleware,
  validateRequest(updateUserValidationSchema),
  userController.updateUserProfile,
);
router.get('/top-rated',userController.getTopRatedProviders);

// Get user details by id
router.get('/:id',userController.getUserByUserId);
// Top rated providers

const userRoute = router;

export default userRoute;
