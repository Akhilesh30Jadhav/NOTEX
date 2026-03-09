import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getMessages, sendMessage, getRooms } from '../controllers/chatController.js';

const router = Router();
router.get('/rooms', protect, getRooms);
router.get('/:room', protect, getMessages);
router.post('/:room', protect, sendMessage);
export default router;
