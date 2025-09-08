import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST() {
  try {
    // Supprimer tous les statuts SAUF "delayed" 
    // car tous les autres statuts sont déterminés par la logique temporelle
    const result = await query(
      `DELETE FROM events_state 
       WHERE status != 'delayed' 
       RETURNING id`
    )
    
    return NextResponse.json({
      success: true,
      message: `Nettoyé ${result.rowCount} statuts incorrects`,
      cleanedIds: result.rows.map(r => r.id)
    })
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error)
    return NextResponse.json(
      { error: 'Erreur lors du nettoyage' },
      { status: 500 }
    )
  }
}

// GET pour vérifier les statuts actuels
export async function GET() {
  try {
    const result = await query('SELECT id, status FROM events_state ORDER BY id')
    
    return NextResponse.json({
      totalRecords: result.rowCount,
      statuses: result.rows
    })
  } catch (error) {
    console.error('Erreur lors de la lecture:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture' },
      { status: 500 }
    )
  }
}