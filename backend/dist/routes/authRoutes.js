"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', authController_1.authController.register);
router.post('/login', authController_1.authController.login);
router.post('/refresh', authController_1.authController.refresh);
router.post('/logout', authController_1.authController.logout);
router.get('/profile', auth_1.verifyToken, authController_1.authController.getProfile);
exports.default = router;
