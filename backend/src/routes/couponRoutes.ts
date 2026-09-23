import express from 'express';
import { couponController } from '../controllers/couponController';
import { verifyToken, checkRole } from '../middleware/auth';

const router = express.Router();

// Public route for applying a coupon in the cart
router.post('/apply', verifyToken, couponController.applyCoupon);

// Admin-only routes
router.use(verifyToken, checkRole(['ADMIN']));
router.post('/', couponController.createCoupon);
router.get('/', couponController.getCoupons);
router.put('/:id', couponController.updateCoupon);
router.patch('/:id/deactivate', couponController.deactivateCoupon);

export default router;
