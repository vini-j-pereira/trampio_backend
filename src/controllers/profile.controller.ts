import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
    getProfileService,
    updateProfileService,
    addPortfolioPhotoService,
    removePortfolioPhotoService
} from '../services/profile.service';
import { ZodError } from 'zod';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const user = await getProfileService(req.user!.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const profile = await updateProfileService(req.user!.id, req.user!.role, req.body);
        res.json(profile);
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: err.errors[0].message });
            return;
        }
        next(err);
    }
}

export async function addPortfolioPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { url, description } = req.body;
        const photo = await addPortfolioPhotoService(req.user!.id, url, description);
        res.status(201).json(photo);
    } catch (err) {
        next(err);
    }
}

export async function removePortfolioPhoto(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await removePortfolioPhotoService(req.user!.id, req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}
