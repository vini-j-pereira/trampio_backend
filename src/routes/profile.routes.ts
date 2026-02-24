import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

// GET  /api/profile — full profile of the logged-in user
router.get('/', authMiddleware, getProfile);

// PATCH /api/profile — update profile fields
router.patch('/', authMiddleware, updateProfile);

export default router;
