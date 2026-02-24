import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ZodError } from 'zod';
import {
    listTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from '../services/transactions.service';

export async function getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const month = req.query.month ? Number(req.query.month) : undefined;
        const year = req.query.year ? Number(req.query.year) : undefined;
        const txs = await listTransactions(req.user!.id, month, year);
        res.json(txs);
    } catch (err) { next(err); }
}

export async function createTransactionHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const tx = await createTransaction(req.user!.id, req.body);
        res.status(201).json(tx);
    } catch (err) {
        if (err instanceof ZodError) { res.status(400).json({ error: err.errors[0].message }); return; }
        next(err);
    }
}

export async function updateTransactionHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const tx = await updateTransaction(req.user!.id, req.params.id, req.body);
        res.json(tx);
    } catch (err) {
        if (err instanceof ZodError) { res.status(400).json({ error: err.errors[0].message }); return; }
        next(err);
    }
}

export async function deleteTransactionHandler(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await deleteTransaction(req.user!.id, req.params.id);
        res.status(204).end();
    } catch (err) { next(err); }
}
