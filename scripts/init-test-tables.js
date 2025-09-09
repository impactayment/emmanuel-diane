const { Pool } = require('pg')

// Configuration de la connexion
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vhVXr89TkqlG@ep-plain-math-adc11453-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

async function initTestTables() {
  try {
    console.log('Initialisation des tables de test...')
    
    // Ajouter 50 tables
    for (let i = 1; i <= 50; i++) {
      const tableName = `Table ${i}`
      
      await pool.query(
        'INSERT INTO game_registrations (table_number, player_name, registered_at) VALUES ($1, $2, NOW()) ON CONFLICT (table_number) DO NOTHING',
        [tableName, tableName]
      )
      
      console.log(`✅ ${tableName} ajoutée`)
    }
    
    console.log('\n✨ 50 tables ont été initialisées avec succès !')
    
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    await pool.end()
  }
}

initTestTables()