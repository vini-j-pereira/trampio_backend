// ─── Service Requests Service ─────────────────────────────
import { z } from 'zod';
import { ClientProfile } from '../models/ClientProfile';
import { ServiceRequest, ServiceRequestProfessional } from '../models/ServiceRequest';

// ─── Schemas ──────────────────────────────────────────────

export const createRequestSchema = z.object({
    title: z.string().min(3, 'Título é obrigatório'),
    description: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
    urgency: z.enum(['URGENTE', 'NORMAL', 'FLEXIVEL']).default('NORMAL'),
    photo_url: z.string().url().optional().nullable(),
    professionals: z.array(z.string().min(2)).optional().default([]),
});

export const updateRequestSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    urgency: z.enum(['URGENTE', 'NORMAL', 'FLEXIVEL']).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED']).optional(),
    photo_url: z.string().url().optional().nullable(),
    professionals: z.array(z.string().min(2)).optional(),
});

// ─── Helpers ──────────────────────────────────────────────

async function getClientProfile(userId: string) {
    const profile = await ClientProfile.findOne({ where: { user_id: userId } });
    if (!profile) throw Object.assign(new Error('Perfil de cliente não encontrado.'), { status: 404 });
    return profile;
}

async function ownsRequest(requestId: string, clientId: string) {
    const req = await ServiceRequest.findOne({
        where: { id: requestId, client_id: clientId },
        include: [{ model: ServiceRequestProfessional, as: 'professionals' }],
    });
    if (!req) throw Object.assign(new Error('Pedido não encontrado ou sem permissão.'), { status: 404 });
    return req;
}

// ─── CRUD ─────────────────────────────────────────────────

export async function listRequests(userId: string) {
    const profile = await getClientProfile(userId);
    return ServiceRequest.findAll({
        where: { client_id: profile.id },
        include: [{ model: ServiceRequestProfessional, as: 'professionals' }],
        order: [['created_at', 'DESC']],
    });
}

export async function createRequest(userId: string, body: unknown) {
    const profile = await getClientProfile(userId);
    const data = createRequestSchema.parse(body);

    const request = await ServiceRequest.create({
        client_id: profile.id,
        title: data.title,
        description: data.description,
        urgency: data.urgency,
        photo_url: data.photo_url ?? undefined,
    });

    // Create professional slots
    if (data.professionals.length > 0) {
        await ServiceRequestProfessional.bulkCreate(
            data.professionals.map((profession) => ({
                request_id: request.id,
                profession,
            }))
        );
    }

    return ownsRequest(request.id, profile.id); // return with professionals included
}

export async function updateRequest(userId: string, requestId: string, body: unknown) {
    const profile = await getClientProfile(userId);
    const request = await ownsRequest(requestId, profile.id);
    const data = updateRequestSchema.parse(body);

    const { professionals, photo_url, ...rest } = data;
    await request.update({ ...rest, photo_url: photo_url ?? undefined });

    // Replace professionals if provided
    if (professionals !== undefined) {
        await ServiceRequestProfessional.destroy({ where: { request_id: request.id } });
        if (professionals.length > 0) {
            await ServiceRequestProfessional.bulkCreate(
                professionals.map((profession) => ({
                    request_id: request.id,
                    profession,
                }))
            );
        }
    }

    return ownsRequest(request.id, profile.id);
}

export async function deleteRequest(userId: string, requestId: string) {
    const profile = await getClientProfile(userId);
    const request = await ownsRequest(requestId, profile.id);
    await request.destroy();
}
