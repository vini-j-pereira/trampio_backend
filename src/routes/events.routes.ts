import { Router } from 'express';
import { authMiddleware, roleGuard } from '../middleware/auth';
import {
    getEvents,
    createEventHandler,
    updateEventHandler,
    deleteEventHandler,
} from '../controllers/events.controller';

const router = Router();

// All events routes require auth + PROVIDER role
router.use(authMiddleware, roleGuard('PROVIDER'));

router.get('/', getEvents);
router.post('/', createEventHandler);
router.patch('/:id', updateEventHandler);
router.delete('/:id', deleteEventHandler);

export default router;
