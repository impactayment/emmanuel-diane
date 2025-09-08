import { NextRequest, NextResponse } from "next/server"
import { query, initializeTables } from "@/lib/db"

interface EventsState {
  eventStatuses: Record<string, "upcoming" | "current" | "completed" | "delayed">
  eventVisibility: Record<string, boolean>
  lastUpdated: string
}

// S'assurer que les tables sont initialisées
let tablesInitialized = false
let initPromise: Promise<void> | null = null

async function ensureTablesExist() {
  if (tablesInitialized) return
  
  if (!initPromise) {
    initPromise = initializeTables()
      .then(() => {
        tablesInitialized = true
      })
      .catch((error) => {
        console.error('Failed to initialize tables:', error)
        initPromise = null
        throw error
      })
  }
  
  return initPromise
}

export async function GET() {
  try {
    await ensureTablesExist()
    
    // Récupérer tous les statuts d'événements
    const result = await query('SELECT * FROM events_state')
    
    // Convertir en format attendu
    const eventStatuses: Record<string, string> = {}
    const eventVisibility: Record<string, boolean> = {}
    
    for (const row of result.rows) {
      // Ne retourner que les statuts "delayed" car les autres sont déterminés par l'heure
      // Ceci empêche de retourner des statuts "completed" incorrects pour des événements futurs
      if (row.status === "delayed") {
        eventStatuses[row.id] = row.status
      }
      eventVisibility[row.id] = row.visibility
    }
    
    return NextResponse.json({
      eventStatuses,
      eventVisibility,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur lors de la lecture des données:', error)
    return NextResponse.json(
      { 
        eventStatuses: {},
        eventVisibility: {},
        lastUpdated: new Date().toISOString()
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTablesExist()
    
    const body = await request.json()
    const { eventStatuses, eventVisibility } = body
    
    // Mettre à jour ou insérer les statuts
    if (eventStatuses) {
      for (const [eventId, status] of Object.entries(eventStatuses)) {
        // NE JAMAIS sauvegarder "completed" pour un événement qui n'est pas passé
        // Seuls les statuts "delayed" peuvent être sauvegardés manuellement par l'admin
        // Les autres statuts sont déterminés par la logique temporelle
        if (status === "delayed") {
          await query(
            `INSERT INTO events_state (id, status, updated_at) 
             VALUES ($1, $2, CURRENT_TIMESTAMP) 
             ON CONFLICT (id) 
             DO UPDATE SET status = $2, updated_at = CURRENT_TIMESTAMP`,
            [eventId, status]
          )
        }
        // Ignorer les autres statuts car ils sont déterminés par l'heure
      }
    }
    
    // Mettre à jour la visibilité
    if (eventVisibility) {
      for (const [eventId, visibility] of Object.entries(eventVisibility)) {
        await query(
          `INSERT INTO events_state (id, status, visibility, updated_at) 
           VALUES ($1, 'upcoming', $2, CURRENT_TIMESTAMP) 
           ON CONFLICT (id) 
           DO UPDATE SET visibility = $2, updated_at = CURRENT_TIMESTAMP`,
          [eventId, visibility]
        )
      }
    }
    
    // Retourner l'état mis à jour
    return GET()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}