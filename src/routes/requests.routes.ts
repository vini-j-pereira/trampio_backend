import { Router } from 'express';
import { authMiddleware, roleGuard } from '../middleware/auth';
import {
    getRequests,
    createRequestHandler,
    updateRequestHandler,
    deleteRequestHandler,
} from '../controllers/requests.controller';

const router = Router();

// All request routes require auth + CLIENT_CPF role
router.use(authMiddleware, roleGuard('CLIENT_CPF'));

router.get('/', getRequests);
router.post('/', createRequestHandler);
router.patch('/:id', updateRequestHandler);
router.delete('/:id', deleteRequestHandler);

export default router;
