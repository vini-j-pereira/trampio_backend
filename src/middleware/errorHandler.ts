import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: Error & { status?: number; statusCode?: number },
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor.';

    if (process.env.NODE_ENV !== 'production') {
        console.error(`[ERROR] ${status}: ${message}`, err.stack);
    }

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
