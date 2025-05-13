import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: false, // Desative SSL para desenvolvimento
  connectionTimeoutMillis: 5000,
});

// Teste de conexão inicial
db.query('SELECT NOW()')
  .then(() => console.log('✅ Conexão com PostgreSQL estabelecida!'))
  .catch(err => console.error('❌ Erro na conexão com PostgreSQL:', err));

export default db;