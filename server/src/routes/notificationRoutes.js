import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, markRead } from '../controllers/notificationController.js';

const router = Router();
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markRead);
export default router;
