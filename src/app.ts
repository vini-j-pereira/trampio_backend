import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import eventsRoutes from './routes/events.routes';
import transactionsRoutes from './routes/transactions.routes';
import requestsRoutes from './routes/requests.routes';
import passwordRoutes from './routes/password.routes';
import searchRoutes from './routes/search.routes';

const app = express();

// ─── Segurança & Performance ──────────────────────────────
app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// ─── Rotas ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/search', searchRoutes);

// ─── 404 ──────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

export default app;
