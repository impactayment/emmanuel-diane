import { NextRequest, NextResponse } from "next/server"
import { query, initializeTables } from "@/lib/db"

interface GameState {
  registeredTables: Record<string, { registeredAt: string; playerName: string }>
  tableProgress: Record<string, any>
  leaderboard: {
    topScores: Array<{ table: string; score: number }>
    lastUpdated: string
  }
  gameConfig: {
    isLocked: boolean
    currentActivePhase: number
    winners: string[]
  }
  lastUpdated: string
}

// S'assurer que les tables sont initialisées
let tablesInitialized = false
async function ensureTablesExist() {
  if (!tablesInitialized) {
    await initializeTables()
    tablesInitialized = true
  }
}

export async function GET() {
  try {
    await ensureTablesExist()
    
    // Récupérer les inscriptions
    const registrations = await query('SELECT * FROM game_registrations')
    const registeredTables: Record<string, any> = {}
    for (const row of registrations.rows) {
      registeredTables[row.table_number] = {
        registeredAt: row.registered_at,
        playerName: row.player_name || row.table_number
      }
    }
    
    // Récupérer la progression
    const progressResult = await query('SELECT * FROM game_progress ORDER BY table_number, phase')
    const tableProgress: Record<string, any> = {}
    
    // D'abord, initialiser tous les tableaux avec les 3 phases
    const tablesWithProgress = new Set<string>()
    for (const row of progressResult.rows) {
      tablesWithProgress.add(row.table_number)
    }
    
    // Initialiser les structures pour toutes les tables inscrites
    for (const tableNumber of Object.keys(registeredTables)) {
      tableProgress[tableNumber] = {
        phases: [
          { phase: 1, completed: false, score: 0, answers: [], completedAt: null },
          { phase: 2, completed: false, score: 0, answers: [], completedAt: null },
          { phase: 3, completed: false, score: 0, answers: [], completedAt: null }
        ],
        currentPhase: 1,
        currentQuestion: 0,
        totalScore: 0,
        lastActivity: new Date().toISOString()
      }
    }
    
    // Ensuite, mettre à jour avec les données réelles de la base
    for (const row of progressResult.rows) {
      if (tableProgress[row.table_number]) {
        const phaseIndex = row.phase - 1 // Les phases sont 1-indexées dans la DB
        if (phaseIndex >= 0 && phaseIndex < 3) {
          tableProgress[row.table_number].phases[phaseIndex] = {
            phase: row.phase,
            completed: row.completed,
            score: row.score,
            answers: row.answers || [],
            completedAt: row.completed_at
          }
          tableProgress[row.table_number].totalScore += row.score || 0
        }
      }
    }
    
    // Récupérer la configuration
    const configResult = await query('SELECT * FROM game_config')
    let gameConfig = {
      isLocked: false,
      currentActivePhase: 1,
      winners: []
    }
    
    for (const row of configResult.rows) {
      if (row.key === 'gameConfig') {
        gameConfig = row.value
      }
    }
    
    // Calculer le classement
    const topScores = Object.entries(tableProgress)
      .map(([table, progress]) => ({ table, score: progress.totalScore }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    
    return NextResponse.json({
      registeredTables,
      tableProgress,
      leaderboard: {
        topScores,
        lastUpdated: new Date().toISOString()
      },
      gameConfig,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur lors de la lecture des données du jeu:', error)
    return NextResponse.json({
      registeredTables: {},
      tableProgress: {},
      leaderboard: { topScores: [], lastUpdated: new Date().toISOString() },
      gameConfig: { isLocked: false, currentActivePhase: 1, winners: [] },
      lastUpdated: new Date().toISOString()
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTablesExist()
    
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'registerTable':
        await query(
          'INSERT INTO game_registrations (table_number, player_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [data.tableNumber, data.tableNumber]
        )
        break
        
      case 'updateProgress': {
        // Sauvegarder la progression après chaque question
        const { tableNumber, progress } = data
        
        // Enregistrer la table si elle n'existe pas
        await query(
          'INSERT INTO game_registrations (table_number, player_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [tableNumber, tableNumber]
        )
        
        // Sauvegarder l'état actuel (réponses partielles)
        if (progress.currentPhase && progress.answers) {
          await query(
            `INSERT INTO game_progress (table_number, phase, completed, score, answers)
             VALUES ($1, $2, false, 0, $3)
             ON CONFLICT (table_number, phase) 
             DO UPDATE SET answers = $3`,
            [tableNumber, progress.currentPhase, JSON.stringify(progress.answers)]
          )
        }
        break
      }
        
      case 'completePhase': {
        const { tableNumber, phaseData } = data
        await query(
          `INSERT INTO game_progress (table_number, phase, completed, score, answers, completed_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (table_number, phase) 
           DO UPDATE SET 
             completed = $3,
             score = $4,
             answers = $5,
             completed_at = $6`,
          [
            tableNumber,
            phaseData.phase,
            phaseData.completed,
            phaseData.score,
            JSON.stringify(phaseData.answers),
            phaseData.completedAt || new Date().toISOString()
          ]
        )
        break
      }
        
      case 'updateGameConfig':
        await query(
          `INSERT INTO game_config (key, value) 
           VALUES ('gameConfig', $1) 
           ON CONFLICT (key) 
           DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
          [JSON.stringify(data.config)]
        )
        break
        
      case 'resetGame':
        // Supprimer toutes les données
        await query('DELETE FROM game_progress')
        await query('DELETE FROM game_registrations')
        await query('DELETE FROM game_config')
        break
    }
    
    // Retourner l'état mis à jour
    return GET()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du jeu:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}