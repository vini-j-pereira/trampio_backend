import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ZodError } from 'zod';
import {
    listRequests,
    createRequest,
    updateRequest,
    deleteRequest,
} from '../services/requests.service';

export async function getRequests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const requests = await listRequests(req.user!.id);
        res.json(requests);
    } catch (err) { next(err); }
}

export async function createRequestHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const request = await createRequest(req.user!.id, req.body);
        res.status(201).json(request);
    } catch (err) {
        if (err instanceof ZodError) { res.status(400).json({ error: err.errors[0].message }); return; }
        next(err);
    }
}

export async function updateRequestHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const request = await updateRequest(req.user!.id, req.params.id, req.body);
        res.json(request);
    } catch (err) {
        if (err instanceof ZodError) { res.status(400).json({ error: err.errors[0].message }); return; }
        next(err);
    }
}

export async function deleteRequestHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await deleteRequest(req.user!.id, req.params.id);
        res.status(204).end();
    } catch (err) { next(err); }
}
