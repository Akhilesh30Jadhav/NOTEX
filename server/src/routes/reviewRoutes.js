import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { addReview, getReviews } from '../controllers/reviewController.js';

const router = Router();
router.get('/:materialId', getReviews);
router.post('/:materialId', protect, addReview);
export default router;
