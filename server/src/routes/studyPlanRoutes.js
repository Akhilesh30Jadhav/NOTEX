import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/studyPlanController.js';

const router = Router();
router.get('/', protect, getPlans);
router.post('/', protect, createPlan);
router.put('/:id', protect, updatePlan);
router.delete('/:id', protect, deletePlan);
export default router;
