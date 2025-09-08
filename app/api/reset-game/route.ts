import { NextRequest, NextResponse } from "next/server"
import { query, initializeTables } from "@/lib/db"

// S'assurer que les tables sont initialisées
let tablesInitialized = false
async function ensureTablesExist() {
  if (!tablesInitialized) {
    await initializeTables()
    tablesInitialized = true
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier le mot de passe
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')
    
    if (password !== 'FD2025RESET') {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    await ensureTablesExist()
    
    // Compter les données avant suppression
    const beforeProgress = await query('SELECT COUNT(*) FROM game_progress')
    const beforeRegistrations = await query('SELECT COUNT(*) FROM game_registrations')
    
    // Supprimer toutes les progressions de jeu
    await query('DELETE FROM game_progress')
    
    // Optionnel : Garder les tables inscrites ou les supprimer aussi
    // Si vous voulez garder les tables mais juste réinitialiser les scores, commentez la ligne suivante
    // await query('DELETE FROM game_registrations')
    
    // Supprimer la configuration du jeu
    await query('DELETE FROM game_config')
    
    // Compter après suppression
    const afterProgress = await query('SELECT COUNT(*) FROM game_progress')
    const afterRegistrations = await query('SELECT COUNT(*) FROM game_registrations')
    
    return NextResponse.json({
      success: true,
      message: 'Classement réinitialisé avec succès',
      deleted: {
        progress: beforeProgress.rows[0].count,
        // registrations: beforeRegistrations.rows[0].count - afterRegistrations.rows[0].count
      },
      remaining: {
        progress: afterProgress.rows[0].count,
        registrations: afterRegistrations.rows[0].count
      }
    })
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation', details: error.message },
      { status: 500 }
    )
  }
}