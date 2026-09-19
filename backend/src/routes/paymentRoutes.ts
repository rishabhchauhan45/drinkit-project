import express from 'express';
import { paymentController } from '../controllers/paymentController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.post('/create-order', verifyToken, paymentController.createOrder);
router.post('/verify', verifyToken, paymentController.verifyPayment);

export default router;
