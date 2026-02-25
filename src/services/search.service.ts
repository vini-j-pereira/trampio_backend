import { Op } from 'sequelize';
import { ProviderProfile } from '../models/ProviderProfile';

export interface ProviderSearchResult {
    id: string;
    user_id: string;
    name: string;
    area: string;
    bio?: string;
    avatar_url?: string;
    city?: string;
    state?: string;
    rating: number;
    rating_count: number;
    experience_yrs: number;
    availability: string;
    radius_km: number;
}

export async function searchProvidersService(params: {
    q?: string;
    area?: string;
    city?: string;
    state?: string;
    availability?: string;
}): Promise<ProviderSearchResult[]> {
    const where: Record<string, unknown> = {};

    // Filter by area/service type
    if (params.area && params.area !== 'todos') {
        where.area = { [Op.iLike]: `%${params.area}%` };
    }

    // Free-text: match name, area, bio, city
    if (params.q) {
        const q = `%${params.q}%`;
        where[Op.or as unknown as string] = [
            { name: { [Op.iLike]: q } },
            { area: { [Op.iLike]: q } },
            { bio: { [Op.iLike]: q } },
            { city: { [Op.iLike]: q } },
        ] as unknown[];
    }

    if (params.city) {
        where.city = { [Op.iLike]: `%${params.city}%` };
    }

    if (params.state) {
        where.state = params.state.toUpperCase();
    }

    if (params.availability) {
        where.availability = params.availability.toUpperCase();
    }

    const rows = await ProviderProfile.findAll({
        where,
        attributes: [
            'id', 'user_id', 'name', 'area', 'bio',
            'avatar_url', 'city', 'state', 'rating',
            'rating_count', 'experience_yrs', 'availability', 'radius_km', 'company_name',
        ],
        order: [['rating', 'DESC']],
        limit: 50,
    });
    return rows.map((r) => r.toJSON() as ProviderSearchResult);
}

export async function getProviderById(id: string): Promise<ProviderSearchResult | null> {
    const provider = await ProviderProfile.findByPk(id, {
        attributes: [
            'id', 'user_id', 'name', 'area', 'bio',
            'avatar_url', 'city', 'state', 'rating',
            'rating_count', 'experience_yrs', 'availability', 'radius_km', 'company_name',
        ],
    });

    return provider ? (provider.toJSON() as ProviderSearchResult) : null;
}
