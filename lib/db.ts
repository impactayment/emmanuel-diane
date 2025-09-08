import { Pool } from 'pg'

// Configuration de la connexion à Neon
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_vhVXr89TkqlG@ep-plain-math-adc11453-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'

// Créer un pool de connexions
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Augmenter le timeout à 10 secondes
})

// Fonction helper pour exécuter des requêtes
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Initialiser les tables si elles n'existent pas
export async function initializeTables() {
  try {
    // Table pour les statuts des événements
    await query(`
      CREATE TABLE IF NOT EXISTS events_state (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        visibility BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Table pour les inscriptions du jeu
    await query(`
      CREATE TABLE IF NOT EXISTS game_registrations (
        table_number TEXT PRIMARY KEY,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        player_name TEXT
      )
    `)

    // Table pour la progression du jeu
    await query(`
      CREATE TABLE IF NOT EXISTS game_progress (
        id SERIAL PRIMARY KEY,
        table_number TEXT NOT NULL,
        phase INTEGER NOT NULL,
        completed BOOLEAN DEFAULT false,
        score INTEGER DEFAULT 0,
        answers JSONB,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(table_number, phase)
      )
    `)

    // Table pour la configuration du jeu
    await query(`
      CREATE TABLE IF NOT EXISTS game_config (
        key TEXT PRIMARY KEY,
        value JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Créer des index pour améliorer les performances
    await query(`
      CREATE INDEX IF NOT EXISTS idx_game_progress_table ON game_progress(table_number)
    `)

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Error initializing database tables:', error)
    throw error
  }
}