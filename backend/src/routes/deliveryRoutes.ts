import express from 'express';
import { deliveryController } from '../controllers/deliveryController';
import { verifyToken, checkRole } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);
router.use(checkRole(['DELIVERY_PARTNER']));

router.get('/orders', deliveryController.getAssignedOrders);
router.put('/orders/:id/status', deliveryController.updateOrderStatus);
router.post('/location', deliveryController.updateLocation);
router.post('/status', deliveryController.toggleOnlineStatus);

export default router;
