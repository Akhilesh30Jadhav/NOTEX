import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getDocs, createDoc, getDoc, updateDoc, addCollaborator } from '../controllers/noteDocController.js';

const router = Router();
router.get('/', protect, getDocs);
router.post('/', protect, createDoc);
router.get('/:id', protect, getDoc);
router.put('/:id', protect, updateDoc);
router.post('/:id/collaborator', protect, addCollaborator);
export default router;
