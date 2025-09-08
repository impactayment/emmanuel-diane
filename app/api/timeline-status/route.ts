import { type NextRequest, NextResponse } from "next/server"

// Simulation d'une base de données en mémoire (en production, utilisez une vraie DB)
let eventStatuses: Record<string, "upcoming" | "current" | "completed" | "delayed"> = {}
let eventVisibility: Record<string, boolean> = {}
let lastUpdated = Date.now()

export async function GET() {
  return NextResponse.json({
    statuses: eventStatuses,
    visibility: eventVisibility,
    lastUpdated,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, status, visibility, timestamp, resetAll } = await request.json()

    // Si resetAll est true, réinitialiser tous les statuts
    if (resetAll) {
      eventStatuses = {}
      lastUpdated = timestamp || Date.now()
      
      return NextResponse.json({
        success: true,
        statuses: eventStatuses,
        visibility: eventVisibility,
        lastUpdated,
      })
    }

    // Mettre à jour le statut ou la visibilité
    if (status !== undefined) {
      eventStatuses[eventId] = status
    }
    if (visibility !== undefined) {
      eventVisibility[eventId] = visibility
    }
    lastUpdated = timestamp || Date.now()

    return NextResponse.json({
      success: true,
      statuses: eventStatuses,
      visibility: eventVisibility,
      lastUpdated,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { statuses, visibility, timestamp } = await request.json()

    // Remplacer tous les statuts et visibilités
    if (statuses) {
      eventStatuses = { ...statuses }
    }
    if (visibility) {
      eventVisibility = { ...visibility }
    }
    lastUpdated = timestamp || Date.now()

    return NextResponse.json({
      success: true,
      statuses: eventStatuses,
      visibility: eventVisibility,
      lastUpdated,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la synchronisation" }, { status: 500 })
  }
}
