import validateRequest from '@src/middlewares/validateRequest';
import * as userController from '@src/modules/user/user.controller';
import { createUserValidationSchema } from '@src/modules/user/user.validation';
import { Router } from 'express';
import * as authController from './auth.controller';
import { loginUserValidationSchema } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(createUserValidationSchema),
  userController.createUser,
);
router.post(
  '/login',
  validateRequest(loginUserValidationSchema),
  authController.loginUser,
);
router.get('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authController.logout);

export default router;
