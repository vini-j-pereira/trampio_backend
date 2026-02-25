import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
    getProfile,
    updateProfile,
    addPortfolioPhoto,
    removePortfolioPhoto
} from '../controllers/profile.controller';

const router = Router();

// GET  /api/profile — full profile of the logged-in user
router.get('/', authMiddleware, getProfile);

// PATCH /api/profile — update profile fields
router.patch('/', authMiddleware, updateProfile);

// POST /api/profile/portfolio — add photo to portfolio
router.post('/portfolio', authMiddleware, addPortfolioPhoto);

// DELETE /api/profile/portfolio/:id — remove photo from portfolio
router.delete('/portfolio/:id', authMiddleware, removePortfolioPhoto);

export default router;
