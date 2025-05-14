import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Opcional: teste de conexão
pool.connect()
  .then(() => console.log('🟢 Conectado ao PostgreSQL com sucesso!'))
  .catch((err) => console.error('🔴 Erro ao conectar ao PostgreSQL:', err));
