// ─── Transactions Service ─────────────────────────────────
import { z } from 'zod';
import { ProviderProfile } from '../models/ProviderProfile';
import { Transaction } from '../models/Transaction';

// ─── Schemas ──────────────────────────────────────────────

export const createTransactionSchema = z.object({
    type: z.enum(['INCOME', 'EXPENSE', 'RECEIVABLE']),
    value: z.number().positive('Valor deve ser positivo'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
    description: z.string().min(2, 'Descrição é obrigatória'),
    category: z.string().default('Serviço'),
    calendar_event_id: z.string().uuid().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

// ─── Helpers ──────────────────────────────────────────────

async function getProviderProfile(userId: string) {
    const profile = await ProviderProfile.findOne({ where: { user_id: userId } });
    if (!profile) throw Object.assign(new Error('Perfil de prestador não encontrado.'), { status: 404 });
    return profile;
}

async function ownsTransaction(txId: string, providerId: string) {
    const tx = await Transaction.findOne({ where: { id: txId, provider_id: providerId } });
    if (!tx) throw Object.assign(new Error('Transação não encontrada ou sem permissão.'), { status: 404 });
    return tx;
}

// ─── CRUD ─────────────────────────────────────────────────

export async function listTransactions(userId: string, month?: number, year?: number) {
    const profile = await getProviderProfile(userId);
    const where: Record<string, unknown> = { provider_id: profile.id };

    if (month && year) {
        const start = `${year}-${String(month).padStart(2, '0')}-01`;
        const end = `${year}-${String(month).padStart(2, '0')}-31`;
        where.date = { $between: [start, end] };
    }

    return Transaction.findAll({ where, order: [['date', 'DESC']] });
}

export async function createTransaction(userId: string, body: unknown) {
    const profile = await getProviderProfile(userId);
    const data = createTransactionSchema.parse(body);
    return Transaction.create({ ...data, provider_id: profile.id, calendar_event_id: data.calendar_event_id ?? undefined });
}

export async function updateTransaction(userId: string, txId: string, body: unknown) {
    const profile = await getProviderProfile(userId);
    const tx = await ownsTransaction(txId, profile.id);
    const data = updateTransactionSchema.parse(body);
    await tx.update(data);
    return tx;
}

export async function deleteTransaction(userId: string, txId: string) {
    const profile = await getProviderProfile(userId);
    const tx = await ownsTransaction(txId, profile.id);
    await tx.destroy();
}
