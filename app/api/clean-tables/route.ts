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
    
    if (password !== 'FD2025CLEAN') {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    await ensureTablesExist()
    
    // Récupérer toutes les tables enregistrées
    const allTables = await query('SELECT table_number FROM game_registrations')
    
    const deletedTables = []
    const keptTables = []
    
    // Parcourir toutes les tables
    for (const row of allTables.rows) {
      const tableName = row.table_number
      
      // Vérifier si c'est une table valide (Table 1 à Table 50)
      if (/^Table ([1-9]|[1-4][0-9]|50)$/.test(tableName)) {
        keptTables.push(tableName)
      } else {
        // Supprimer cette table et toutes ses données
        try {
          // Supprimer la progression
          await query('DELETE FROM game_progress WHERE table_number = $1', [tableName])
          // Supprimer l'inscription
          await query('DELETE FROM game_registrations WHERE table_number = $1', [tableName])
          deletedTables.push(tableName)
        } catch (error) {
          console.error(`Erreur lors de la suppression de ${tableName}:`, error)
        }
      }
    }
    
    // Compter le total des tables restantes
    const remainingTables = await query('SELECT COUNT(*) FROM game_registrations')
    
    return NextResponse.json({
      success: true,
      deletedTables,
      keptTables,
      totalRemaining: remainingTables.rows[0].count,
      message: `Nettoyage terminé: ${deletedTables.length} tables supprimées, ${keptTables.length} tables conservées`
    })
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error)
    return NextResponse.json(
      { error: 'Erreur lors du nettoyage', details: error.message },
      { status: 500 }
    )
  }
}