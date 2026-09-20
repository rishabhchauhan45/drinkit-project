import express from 'express';
import { adminController } from '../controllers/adminController';
import { verifyToken, checkRole } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(verifyToken);
router.use(checkRole(['ADMIN']));

// Dashboard metrics
router.get('/dashboard', adminController.getDashboardStats);

// Orders
router.get('/orders', adminController.getAllOrders);

// Inventory
router.get('/inventory', adminController.getInventory);
router.put('/inventory/:productId', adminController.updateInventory);

export default router;
