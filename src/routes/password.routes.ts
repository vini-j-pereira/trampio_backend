import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/password.controller';

const router = Router();

// POST /api/password/forgot
router.post('/forgot', forgotPassword);

// POST /api/password/reset
router.post('/reset', resetPassword);

export default router;
