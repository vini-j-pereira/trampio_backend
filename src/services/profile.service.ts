// ─── Profile Service ──────────────────────────────────────
import { z } from 'zod';
import { User } from '../models/User';
import { ClientProfile } from '../models/ClientProfile';
import { CondoProfile } from '../models/CondoProfile';
import { ProviderProfile } from '../models/ProviderProfile';

// ─── Update schemas ───────────────────────────────────────

export const updateClientSchema = z.object({
    name: z.string().min(2).optional(),
    cpf: z.string().optional(),
    avatar_url: z.string().optional().or(z.literal('')), // accepts http URLs and base64 data URLs
    // Full address
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().max(2).optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
});

export const updateProviderSchema = z.object({
    name: z.string().min(2).optional(),
    bio: z.string().optional(),
    area: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    avatar_url: z.string().url().optional().or(z.literal('')),
    company_name: z.string().optional(),
    radius_km: z.number().positive().optional(),
    experience_yrs: z.number().min(0).optional(),
    availability: z.enum(['AVAILABLE', 'BUSY', 'VACATION']).optional(),
    week_goal: z.number().positive().optional(),
    month_goal: z.number().positive().optional(),
});

export const updateCondoSchema = z.object({
    name: z.string().min(2).optional(),
    cnpj: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    avatar_url: z.string().url().optional().or(z.literal('')),
});

// ─── Get full profile ─────────────────────────────────────

export async function getProfileService(userId: string) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'role', 'created_at'],
        include: [
            { model: ClientProfile, as: 'clientProfile' },
            { model: CondoProfile, as: 'condoProfile' },
            { model: ProviderProfile, as: 'providerProfile' },
        ],
    });
    if (!user) throw Object.assign(new Error('Usuário não encontrado.'), { status: 404 });
    return user;
}

// ─── Update profile ───────────────────────────────────────

export async function updateProfileService(
    userId: string,
    role: string,
    body: Record<string, unknown>
) {
    if (role === 'CLIENT_CPF') {
        const data = updateClientSchema.parse(body);
        const profile = await ClientProfile.findOne({ where: { user_id: userId } });
        if (!profile) throw Object.assign(new Error('Perfil não encontrado.'), { status: 404 });
        await profile.update(data);
        return profile;
    }

    if (role === 'CLIENT_CNPJ') {
        const data = updateCondoSchema.parse(body);
        const profile = await CondoProfile.findOne({ where: { user_id: userId } });
        if (!profile) throw Object.assign(new Error('Perfil não encontrado.'), { status: 404 });
        await profile.update(data);
        return profile;
    }

    if (role === 'PROVIDER') {
        const data = updateProviderSchema.parse(body);
        const profile = await ProviderProfile.findOne({ where: { user_id: userId } });
        if (!profile) throw Object.assign(new Error('Perfil não encontrado.'), { status: 404 });
        await profile.update(data);
        return profile;
    }

    throw Object.assign(new Error('Role inválido.'), { status: 400 });
}
