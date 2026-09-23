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

// Delivery Management
router.get('/delivery-partners', adminController.getDeliveryPartners);
router.post('/orders/:id/assign', adminController.assignDeliveryPartner);
// AI Generation
router.post('/seed-ai-data', adminController.seedAiData);

export default router;
