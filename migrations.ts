import { db } from './src/infrastructure/database/db';

async function runMigrations() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(36) PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(5) NOT NULL,
        table_number INTEGER NOT NULL,
        people_count INTEGER NOT NULL,
        status VARCHAR(10) NOT NULL CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'CANCELADA')),
        matter_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Migrações executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro nas migrações:', error);
  } finally {
    await db.end();
  }
}

runMigrations();