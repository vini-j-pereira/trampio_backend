// ─── Password Recovery Service ────────────────────────────
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { PasswordResetToken } from '../models/PasswordResetToken';

// ─── Schemas ──────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
    email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

// ─── Service ──────────────────────────────────────────────

export async function forgotPasswordService(email: string) {
    const user = await User.findOne({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user) return;

    // Invalidate old tokens
    await PasswordResetToken.destroy({ where: { user_id: user.id } });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await PasswordResetToken.create({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
    });

    // In production, send email here.
    // For now, log the token to the console (replace with nodemailer/SES/etc.)
    console.log(`\n[RESET TOKEN] ${user.email} → ${rawToken}\n`);

    return rawToken; // returned for dev only — in prod this goes via email
}

export async function resetPasswordService(rawToken: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const record = await PasswordResetToken.findOne({ where: { token_hash: tokenHash } });
    if (!record) throw Object.assign(new Error('Token inválido ou expirado.'), { status: 400 });

    if (record.expires_at < new Date()) {
        await record.destroy();
        throw Object.assign(new Error('Token expirado.'), { status: 400 });
    }

    const user = await User.findByPk(record.user_id);
    if (!user) throw Object.assign(new Error('Usuário não encontrado.'), { status: 404 });

    const password_hash = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash });
    await record.destroy();
}
