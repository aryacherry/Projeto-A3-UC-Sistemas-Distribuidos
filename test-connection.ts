import { db } from './src/infrastructure/database/db';

async function testConnection() {
  try {
    const client = await db.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    // Teste adicional de query
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL Version:', res.rows[0].version);
    
    client.release();
  } catch (error) {
    console.error('❌ Falha na conexão:', error);
  } finally {
    await db.end();
    process.exit();
  }
}

testConnection();