const path = require('path');
const { db } = require(path.join(__dirname, 'src', 'infrastructure', 'database', 'db'));

async function checkTables() {
  try {
    // Verificar se a tabela existe
    const res = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'reservations'
    `);
    
    if (res.rows.length === 0) {
      console.log('❌ Tabela "reservations" não encontrada!');
    } else {
      console.log('✅ Tabela "reservations" existe');
      
      // Verificar estrutura
      const columns = await db.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'reservations'
      `);
      console.log('\nColunas:', columns.rows);
    }
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
  } finally {
    await db.end();
    process.exit();
  }
}

checkTables();