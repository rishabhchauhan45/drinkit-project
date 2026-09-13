import express from 'express';
import { orderController } from '../controllers/orderController';
import { verifyToken, checkRole } from '../middleware/auth';

const router = express.Router();

router.post('/', verifyToken, orderController.createOrder);
router.get('/:id', verifyToken, orderController.getOrderById);
router.get('/user/:userId', verifyToken, orderController.getUserOrders);
router.put('/:id/status', verifyToken, checkRole(['ADMIN', 'DELIVERY_PARTNER']), orderController.updateOrderStatus);

export default router;
