import { NextResponse } from "next/server"

// Stockage en mémoire (dans un vrai projet, utiliser une base de données)
let gameData = {
  registeredTables: [] as string[],
  tableProgress: {} as Record<string, any>,
  lastUpdated: Date.now()
}

// GET - Récupérer les données du jeu
export async function GET() {
  return NextResponse.json(gameData)
}

// POST - Mettre à jour les données du jeu
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'register':
        // Enregistrer une nouvelle table
        if (!gameData.registeredTables.includes(data.tableNumber)) {
          gameData.registeredTables.push(data.tableNumber)
          gameData.tableProgress[data.tableNumber] = {
            tableNumber: data.tableNumber,
            phases: [
              { phase: 1, completed: false, score: 0, answers: [] },
              { phase: 2, completed: false, score: 0, answers: [] },
              { phase: 3, completed: false, score: 0, answers: [] }
            ],
            totalScore: 0,
            lastActivity: Date.now()
          }
        }
        break

      case 'updateProgress':
        // Mettre à jour la progression d'une table
        if (gameData.tableProgress[data.tableNumber]) {
          gameData.tableProgress[data.tableNumber] = data.progress
        }
        break

      case 'reset':
        // Réinitialiser toutes les données (admin uniquement)
        gameData = {
          registeredTables: [],
          tableProgress: {},
          lastUpdated: Date.now()
        }
        break
    }

    gameData.lastUpdated = Date.now()
    return NextResponse.json({ success: true, data: gameData })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    )
  }
}