// ─── Events Service ───────────────────────────────────────
import { z } from 'zod';
import { Op } from 'sequelize';
import { ProviderProfile } from '../models/ProviderProfile';
import { CalendarEvent } from '../models/CalendarEvent';

// ─── Schemas ──────────────────────────────────────────────

export const createEventSchema = z.object({
    title: z.string().min(2, 'Título é obrigatório'),
    client: z.string().optional(),
    description: z.string().optional(),
    day: z.number().int().min(1).max(31),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2024).max(2100),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido (HH:MM)'),
    reminder: z.string().optional(),
    is_reminder: z.boolean().optional(),
    earnings: z.number().nonnegative().optional(),
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'DONE']).optional(),
});

export const updateEventSchema = createEventSchema.partial();

// ─── Helpers ──────────────────────────────────────────────

async function getProviderProfile(userId: string) {
    const profile = await ProviderProfile.findOne({ where: { user_id: userId } });
    if (!profile) throw Object.assign(new Error('Perfil de prestador não encontrado.'), { status: 404 });
    return profile;
}

async function ownsEvent(eventId: string, providerId: string) {
    const event = await CalendarEvent.findOne({ where: { id: eventId, provider_id: providerId } });
    if (!event) throw Object.assign(new Error('Evento não encontrado ou sem permissão.'), { status: 404 });
    return event;
}

// ─── CRUD ─────────────────────────────────────────────────

export async function listEvents(userId: string, month?: number, year?: number) {
    const profile = await getProviderProfile(userId);
    const where: Record<string, unknown> = { provider_id: profile.id };
    if (month) where.month = month;
    if (year) where.year = year;
    return CalendarEvent.findAll({ where, order: [['year', 'ASC'], ['month', 'ASC'], ['day', 'ASC'], ['time', 'ASC']] });
}

export async function createEvent(userId: string, body: unknown) {
    const profile = await getProviderProfile(userId);
    const data = createEventSchema.parse(body);
    return CalendarEvent.create({ ...data, provider_id: profile.id });
}

export async function updateEvent(userId: string, eventId: string, body: unknown) {
    const profile = await getProviderProfile(userId);
    const event = await ownsEvent(eventId, profile.id);
    const data = updateEventSchema.parse(body);
    await event.update(data);
    return event;
}

export async function deleteEvent(userId: string, eventId: string) {
    const profile = await getProviderProfile(userId);
    const event = await ownsEvent(eventId, profile.id);
    await event.destroy();
}
