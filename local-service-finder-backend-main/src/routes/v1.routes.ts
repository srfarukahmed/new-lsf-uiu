import authRoute from '@src/modules/auth/auth.route';
import bookingRoute from '@src/modules/booking/booking.route';
import serviceRoute from '@src/modules/service/service.route';
import userRoute from '@src/modules/user/user.route';
import { Router } from 'express';
const router = Router();
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/service', serviceRoute);
router.use('/booking', bookingRoute);

export default router;
