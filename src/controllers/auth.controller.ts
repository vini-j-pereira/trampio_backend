import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
    registerSchema,
    loginSchema,
    registerService,
    loginService,
    getMeService,
} from '../services/auth.service';

export async function register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = registerSchema.parse(req.body);
        const result = await registerService(data);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await loginService(email, password);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Não autenticado.' });
            return;
        }
        const user = await getMeService(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
}
