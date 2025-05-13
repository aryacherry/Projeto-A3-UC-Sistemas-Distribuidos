// migration-runner.ts
import { db } from './db';
import fs from 'fs';
import path from 'path';

export async function runMigrations() {
  const migrationFile = path.join(__dirname, 'migrations.sql');
  const sql = fs.readFileSync(migrationFile, 'utf8');
  
  try {
    await db.query(sql);
    console.log('✅ Migrações executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
  }
}