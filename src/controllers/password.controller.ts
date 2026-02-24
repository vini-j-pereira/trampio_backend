import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
    forgotPasswordService,
    forgotPasswordSchema,
    resetPasswordService,
    resetPasswordSchema,
} from '../services/password.service';

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = forgotPasswordSchema.parse(req.body);
        await forgotPasswordService(email);
        // Always respond 200 to prevent email enumeration
        res
            .status(200)
            .json({ message: 'Se esse email existir, um link de recuperação foi enviado.' });
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: err.errors[0].message });
            return;
        }
        next(err);
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, password } = resetPasswordSchema.parse(req.body);
        await resetPasswordService(token, password);
        res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (err) {
        if (err instanceof ZodError) {
            res.status(400).json({ error: err.errors[0].message });
            return;
        }
        next(err);
    }
}
