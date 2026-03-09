import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

const router = Router();
router.get('/me', protect, (req, res, next) => { req.params.id = req.user.id; next(); }, getProfile);
router.get('/:id', getProfile);
router.put('/me', protect, updateProfile);
export default router;
