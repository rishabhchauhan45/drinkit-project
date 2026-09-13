"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.verifyToken, orderController_1.orderController.createOrder);
router.get('/:id', auth_1.verifyToken, orderController_1.orderController.getOrderById);
router.get('/user/:userId', auth_1.verifyToken, orderController_1.orderController.getUserOrders);
router.put('/:id/status', auth_1.verifyToken, (0, auth_1.checkRole)(['ADMIN', 'DELIVERY_PARTNER']), orderController_1.orderController.updateOrderStatus);
exports.default = router;
