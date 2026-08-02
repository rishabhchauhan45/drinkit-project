import express from 'express';
import { productController } from '../controllers/productController';
import { verifyToken, checkRole } from '../middleware/auth';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, checkRole(['ADMIN']), productController.createProduct);
router.put('/:id', verifyToken, checkRole(['ADMIN']), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole(['ADMIN']), productController.deleteProduct);

export default router;
