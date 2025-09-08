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
    // Vérifier le mot de passe pour sécuriser l'endpoint
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')
    
    if (password !== 'FD2025') {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }
    
    await ensureTablesExist()
    
    // Créer les tables 1 à 40
    const results = []
    for (let i = 1; i <= 40; i++) {
      const tableNumber = `Table ${i}`
      
      try {
        // Vérifier si la table existe déjà
        const existing = await query(
          'SELECT * FROM game_registrations WHERE table_number = $1',
          [tableNumber]
        )
        
        if (existing.rows.length === 0) {
          // Enregistrer la table
          await query(
            'INSERT INTO game_registrations (table_number, player_name) VALUES ($1, $2)',
            [tableNumber, tableNumber]
          )
          results.push({ table: tableNumber, status: 'created' })
        } else {
          results.push({ table: tableNumber, status: 'already_exists' })
        }
      } catch (error) {
        results.push({ table: tableNumber, status: 'error', error: error.message })
      }
    }
    
    // Compter le total des tables enregistrées
    const totalTables = await query('SELECT COUNT(*) FROM game_registrations')
    
    return NextResponse.json({
      success: true,
      results,
      totalRegistered: totalTables.rows[0].count,
      message: 'Tables initialisées avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des tables:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation', details: error.message },
      { status: 500 }
    )
  }
}

// Endpoint pour réinitialiser toutes les tables (optionnel)
export async function DELETE(request: NextRequest) {
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
    
    // Supprimer toutes les données du jeu
    await query('DELETE FROM game_progress')
    await query('DELETE FROM game_registrations')
    await query('DELETE FROM game_config')
    
    return NextResponse.json({
      success: true,
      message: 'Toutes les données du jeu ont été réinitialisées'
    })
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation' },
      { status: 500 }
    )
  }
}