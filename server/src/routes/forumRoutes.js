import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getPosts, createPost, addAnswer, toggleUpvote } from '../controllers/forumController.js';

const router = Router();
router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/answer', protect, addAnswer);
router.post('/:id/upvote', protect, toggleUpvote);
export default router;
