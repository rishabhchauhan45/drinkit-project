"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', productController_1.productController.getAllProducts);
router.get('/:id', productController_1.productController.getProductById);
router.post('/', auth_1.verifyToken, (0, auth_1.checkRole)(['ADMIN']), productController_1.productController.createProduct);
router.put('/:id', auth_1.verifyToken, (0, auth_1.checkRole)(['ADMIN']), productController_1.productController.updateProduct);
router.delete('/:id', auth_1.verifyToken, (0, auth_1.checkRole)(['ADMIN']), productController_1.productController.deleteProduct);
exports.default = router;
