"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply auth middleware to all admin routes
router.use(auth_1.verifyToken);
router.use((0, auth_1.checkRole)(['ADMIN']));
// Dashboard metrics
router.get('/dashboard', adminController_1.adminController.getDashboardStats);
// Orders
router.get('/orders', adminController_1.adminController.getAllOrders);
// Inventory
router.get('/inventory', adminController_1.adminController.getInventory);
router.put('/inventory/:productId', adminController_1.adminController.updateInventory);
// Delivery Management
router.get('/delivery-partners', adminController_1.adminController.getDeliveryPartners);
router.post('/orders/:id/assign', adminController_1.adminController.assignDeliveryPartner);
exports.default = router;
