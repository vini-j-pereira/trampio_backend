import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { searchProvidersService } from '../services/search.service';
import { ServiceRequest, ServiceRequestProfessional } from '../models/ServiceRequest';
import { ClientProfile } from '../models/ClientProfile';

const router = Router();

/**
 * GET /api/search/providers
 * Public endpoint — no auth required.
 * Query params: q, area, city, state, availability
 */
router.get('/providers', async (req: Request, res: Response) => {
    try {
        const { q, area, city, state, availability } = req.query as Record<string, string>;
        const results = await searchProvidersService({ q, area, city, state, availability });
        res.json(results);
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro interno.';
        res.status(500).json({ error: msg });
    }
});

/**
 * GET /api/search/requests
 * Public endpoint — providers browse OPEN service requests.
 *
 * Query params:
 *   q           – free text on title/description
 *   urgency     – URGENTE | NORMAL | FLEXIVEL
 *   area        – provider area keyword(s) — matches requested professions OR title/description
 *   city        – filter by client city (also includes requests with no city set)
 *   state       – filter by client state (also includes requests with no state set)
 *   scope       – 'city' | 'state' | 'country' (location strictness)
 */
router.get('/requests', async (req: Request, res: Response) => {
    try {
        const { q, urgency, area, city, state, scope } = req.query as Record<string, string>;
        const requestWhere: Record<string, unknown> = { status: 'OPEN' };

        if (urgency) requestWhere.urgency = urgency.toUpperCase();

        // ── Text / area matching ──────────────────────────────────
        // We match against title, description AND requested professions
        const orConditions: any[] = [];

        if (q) {
            const like = `%${q}%`;
            orConditions.push(
                { title: { [Op.iLike]: like } },
                { description: { [Op.iLike]: like } },
            );
        }

        if (area) {
            const keywords = area
                .split(/\s+/)
                .map(w => w.trim())
                .filter(w => w.length >= 3); // skip short words

            for (const kw of keywords) {
                const like = `%${kw}%`;
                orConditions.push(
                    { title: { [Op.iLike]: like } },
                    { description: { [Op.iLike]: like } },
                    // Match against the joined professions
                    { '$professionals.profession$': { [Op.iLike]: like } }
                );
            }

            // Fallback: no meaningful keywords extracted — match the full phrase
            if (keywords.length === 0) {
                const like = `%${area}%`;
                orConditions.push(
                    { title: { [Op.iLike]: like } },
                    { description: { [Op.iLike]: like } },
                    { '$professionals.profession$': { [Op.iLike]: like } }
                );
            }
        }

        if (orConditions.length > 0) {
            requestWhere[Op.or as unknown as string] = orConditions;
        }

        // ── Location filter ───────────────────────────────────────
        const clientWhere: Record<string, unknown> = {};
        if (scope === 'city' && city) {
            clientWhere.city = { [Op.or]: [{ [Op.iLike]: city }, null] } as unknown;
        } else if (scope === 'state' && state) {
            clientWhere.state = { [Op.or]: [{ [Op.iLike]: state }, null] } as unknown;
        }

        const rows = await ServiceRequest.findAll({
            where: requestWhere,
            attributes: ['id', 'client_id', 'title', 'description', 'urgency', 'photo_url', 'status', 'created_at'],
            include: [
                {
                    model: ClientProfile,
                    as: 'client',
                    attributes: ['name', 'city', 'state', 'neighborhood', 'avatar_url'],
                    where: Object.keys(clientWhere).length > 0 ? clientWhere : undefined,
                    required: false,
                },
                {
                    model: ServiceRequestProfessional,
                    as: 'professionals',
                    attributes: ['profession'],
                    required: false, // keep it left join so we can search it in the main where
                },
            ],
            // subQuery: false is often needed when using include.where or referencing included cols in top-level where
            subQuery: false,
            order: [['created_at', 'DESC']],
            limit: 100,
        });

        res.json(rows.map((r) => r.toJSON()));
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro interno.';
        res.status(500).json({ error: msg });
    }
});

export default router;

