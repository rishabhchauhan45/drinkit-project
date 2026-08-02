import express from 'express';
import { aiController } from '../controllers/aiController';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.post('/verify-age', verifyToken, aiController.verifyAge);
router.get('/recommendations/:userId', verifyToken, aiController.getRecommendations);
router.get('/pairings/:productId', verifyToken, aiController.getPairings);

export default router;
