"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/verify-age', auth_1.verifyToken, aiController_1.aiController.verifyAge);
router.get('/recommendations/:userId', auth_1.verifyToken, aiController_1.aiController.getRecommendations);
router.get('/pairings/:productId', auth_1.verifyToken, aiController_1.aiController.getPairings);
exports.default = router;
