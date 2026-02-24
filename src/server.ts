import 'dotenv/config';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { sequelize } from './config/database';

// Importa todos os models para registrá-los no Sequelize e executar as associações
import './models/index';

import app from './app';

async function bootstrap() {
    console.log('🚀 Iniciando servidor Trampio...');

    // 1. Conectar ao banco
    await connectDatabase();

    // 2. Sincronizar models com o banco (cria tabelas se não existirem)
    //    alter: true → atualiza colunas existentes sem apagar dados
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas com o Supabase.');

    // 3. Iniciar servidor HTTP
    const port = Number(env.PORT);
    app.listen(port, () => {
        console.log(`\n🌐 Servidor rodando em http://localhost:${port}`);
        console.log(`📗 Health check: http://localhost:${port}/api/health`);
        console.log(`🔐 Auth API:     http://localhost:${port}/api/auth`);
        console.log(`\nAmbiente: ${env.NODE_ENV}`);
    });
}

bootstrap().catch((err) => {
    console.error('❌ Falha ao iniciar o servidor:', err);
    process.exit(1);
});
