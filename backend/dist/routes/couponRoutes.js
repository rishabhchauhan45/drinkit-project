"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public route for applying a coupon in the cart
router.post('/apply', auth_1.verifyToken, couponController_1.couponController.applyCoupon);
// Admin-only routes
router.use(auth_1.verifyToken, (0, auth_1.checkRole)(['ADMIN']));
router.post('/', couponController_1.couponController.createCoupon);
router.get('/', couponController_1.couponController.getCoupons);
router.put('/:id', couponController_1.couponController.updateCoupon);
router.patch('/:id/deactivate', couponController_1.couponController.deactivateCoupon);
exports.default = router;
