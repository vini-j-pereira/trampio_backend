import { Router } from 'express';
import { authMiddleware, roleGuard } from '../middleware/auth';
import {
    getTransactions,
    createTransactionHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
} from '../controllers/transactions.controller';

const router = Router();

// All transaction routes require auth + PROVIDER role
router.use(authMiddleware, roleGuard('PROVIDER'));

router.get('/', getTransactions);
router.post('/', createTransactionHandler);
router.patch('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);

export default router;
