import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: env.NODE_ENV === 'development' ? (msg) => console.log(`[SQL] ${msg}`) : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export async function connectDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o Supabase estabelecida com sucesso.');
    } catch (error) {
        console.error('❌ Falha ao conectar ao banco de dados:', error);
        throw error;
    }
}
