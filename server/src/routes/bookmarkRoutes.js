import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { toggleBookmark, getBookmarks } from '../controllers/bookmarkController.js';

const router = Router();
router.get('/', protect, getBookmarks);
router.post('/:materialId', protect, toggleBookmark);
export default router;
