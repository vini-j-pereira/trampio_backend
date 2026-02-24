import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ZodError } from 'zod';
import {
    listEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} from '../services/events.service';

export async function getEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const month = req.query.month ? Number(req.query.month) : undefined;
        const year = req.query.year ? Number(req.query.year) : undefined;
        const events = await listEvents(req.user!.id, month, year);
        res.json(events);
    } catch (err) { next(err); }
}

export async function createEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const event = await createEvent(req.user!.id, req.body);
        res.status(201).json(event);
    } catch (err) {
        if (err instanceof ZodError) { res.status(400).json({ error: err.errors[0].message }); return; }
        next(err);
    }
}

export async function updateEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const event = await updateEvent(req.user!.id, req.params.id, req.body);
        res.json(event);
    } catch (err) {
        if (err instanceof ZodError) { res.status(400).json({ error: err.errors[0].message }); return; }
        next(err);
    }
}

export async function deleteEventHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await deleteEvent(req.user!.id, req.params.id);
        res.status(204).end();
    } catch (err) { next(err); }
}
