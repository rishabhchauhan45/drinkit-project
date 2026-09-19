"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/create-order', auth_1.verifyToken, paymentController_1.paymentController.createOrder);
router.post('/verify', auth_1.verifyToken, paymentController_1.paymentController.verifyPayment);
exports.default = router;
