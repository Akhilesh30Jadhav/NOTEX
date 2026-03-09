import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getVideos, addVideo, incrementView } from '../controllers/videoController.js';

const router = Router();
router.get('/', getVideos);
router.post('/', protect, addVideo);
router.post('/:id/view', incrementView);
export default router;
