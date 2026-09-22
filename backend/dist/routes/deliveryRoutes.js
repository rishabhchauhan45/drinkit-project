"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliveryController_1 = require("../controllers/deliveryController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.verifyToken);
router.use((0, auth_1.checkRole)(['DELIVERY_PARTNER']));
router.get('/orders', deliveryController_1.deliveryController.getAssignedOrders);
router.put('/orders/:id/status', deliveryController_1.deliveryController.updateOrderStatus);
router.post('/location', deliveryController_1.deliveryController.updateLocation);
router.post('/status', deliveryController_1.deliveryController.toggleOnlineStatus);
exports.default = router;
