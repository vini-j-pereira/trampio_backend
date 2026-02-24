import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { User } from '../models/User';
import { ClientProfile } from '../models/ClientProfile';
import { CondoProfile } from '../models/CondoProfile';
import { ProviderProfile } from '../models/ProviderProfile';

// ─── Schemas de validação ─────────────────────────────────

export const registerSchema = z.discriminatedUnion('role', [
    z.object({
        role: z.literal('CLIENT_CPF'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
        name: z.string().min(2, 'Nome é obrigatório'),
        cpf: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
    }),
    z.object({
        role: z.literal('CLIENT_CNPJ'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
        name: z.string().min(2, 'Nome da empresa é obrigatório'),
        cnpj: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
    }),
    z.object({
        role: z.literal('PROVIDER'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
        name: z.string().min(2, 'Nome é obrigatório'),
        document_type: z.enum(['CPF', 'CNPJ']).optional(),
        document: z.string().optional(),
        company_name: z.string().optional(),
        bio: z.string().optional(),
        area: z.string().min(2, 'Área de atuação é obrigatória'),
        radius_km: z.number().optional(),
        experience_yrs: z.number().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
    }),
]);

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

type RegisterInput = z.infer<typeof registerSchema>;

// ─── Service ──────────────────────────────────────────────

function generateToken(user: { id: string; email: string; role: string }) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
}

export async function registerService(data: RegisterInput) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
        throw Object.assign(new Error('Este email já está em uso.'), { status: 409 });
    }

    const password_hash = await bcrypt.hash(data.password, 12);

    const user = await User.create({
        email: data.email,
        password_hash,
        role: data.role,
    });

    // Criar perfil conforme tipo
    if (data.role === 'CLIENT_CPF') {
        await ClientProfile.create({
            user_id: user.id,
            name: data.name,
            cpf: data.cpf,
            city: data.city,
            state: data.state,
        });
    } else if (data.role === 'CLIENT_CNPJ') {
        await CondoProfile.create({
            user_id: user.id,
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            city: data.city,
            state: data.state,
        });
    } else if (data.role === 'PROVIDER') {
        await ProviderProfile.create({
            user_id: user.id,
            name: data.name,
            document_type: data.document_type ?? 'CPF',
            document: data.document,
            company_name: data.company_name,
            bio: data.bio,
            area: data.area,
            radius_km: data.radius_km ?? 10,
            experience_yrs: data.experience_yrs ?? 0,
            city: data.city,
            state: data.state,
        });
    }

    const token = generateToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function loginService(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw Object.assign(new Error('Email ou senha inválidos.'), { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        throw Object.assign(new Error('Email ou senha inválidos.'), { status: 401 });
    }

    const token = generateToken(user);
    return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function getMeService(userId: string) {
    const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'role', 'created_at'],
        include: [
            { model: ClientProfile, as: 'clientProfile' },
            { model: CondoProfile, as: 'condoProfile' },
            { model: ProviderProfile, as: 'providerProfile' },
        ],
    });

    if (!user) {
        throw Object.assign(new Error('Usuário não encontrado.'), { status: 404 });
    }

    return user;
}
