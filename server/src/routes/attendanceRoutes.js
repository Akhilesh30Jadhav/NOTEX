import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { markAttendance, getAttendance } from '../controllers/attendanceController.js';

const router = Router();
router.get('/', protect, getAttendance);
router.post('/', protect, markAttendance);
export default router;
