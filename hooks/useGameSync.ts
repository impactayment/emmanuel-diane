import { useState, useEffect, useCallback } from 'react'

interface PhaseProgress {
  phase: number
  completed: boolean
  score: number
  answers: (string | boolean)[]
  completedAt?: string
}

interface TableProgress {
  phases: PhaseProgress[]
  currentPhase: number
  currentQuestion: number
  totalScore: number
  lastActivity: string
}

interface GameState {
  registeredTables: Record<string, { registeredAt: string; playerName: string }>
  tableProgress: Record<string, TableProgress>
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

export function useGameSync() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données initiales depuis la persistance
  const fetchGameData = useCallback(async () => {
    try {
      const response = await fetch('/api/game-state')
      if (!response.ok) throw new Error('Failed to fetch game data')
      const data = await response.json()
      setGameState(data)
      setError(null)
    } catch (err) {
      setError('Erreur de connexion au serveur')
      console.error('Error fetching game data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Enregistrer une table
  const registerTable = useCallback(async (tableNumber: string) => {
    try {
      const response = await fetch('/api/game-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'registerTable',
          data: { tableNumber }
        })
      })
      
      if (!response.ok) throw new Error('Failed to register table')
      const updatedState = await response.json()
      setGameState(updatedState)
      return true
    } catch (err) {
      console.error('Error registering table:', err)
      setError('Erreur lors de l\'inscription')
      return false
    }
  }, [])

  // Mettre à jour la progression
  const updateProgress = useCallback(async (tableNumber: string, progress: Partial<TableProgress>) => {
    try {
      const response = await fetch('/api/game-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateProgress',
          data: { tableNumber, progress }
        })
      })
      
      if (!response.ok) throw new Error('Failed to update progress')
      const updatedState = await response.json()
      setGameState(updatedState)
    } catch (err) {
      console.error('Error updating progress:', err)
      setError('Erreur lors de la mise à jour')
    }
  }, [])

  // Compléter une phase
  const completePhase = useCallback(async (tableNumber: string, phaseData: PhaseProgress) => {
    try {
      const response = await fetch('/api/game-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'completePhase',
          data: { tableNumber, phaseData }
        })
      })
      
      if (!response.ok) throw new Error('Failed to complete phase')
      const updatedState = await response.json()
      setGameState(updatedState)
    } catch (err) {
      console.error('Error completing phase:', err)
      setError('Erreur lors de la validation de la phase')
    }
  }, [])

  // Polling pour synchronisation en temps réel - plus fréquent pendant le jeu
  useEffect(() => {
    fetchGameData()
    
    // Polling plus intelligent : toutes les 3 secondes pendant le jeu, 10 secondes sinon
    const checkInterval = () => {
      const now = new Date()
      const hour = now.getHours()
      const isGameTime = (hour >= 18 && hour < 23) // Entre 18h et 23h
      return isGameTime ? 3000 : 10000
    }
    
    let interval: NodeJS.Timeout
    const setupInterval = () => {
      interval = setInterval(() => {
        fetchGameData()
        // Réajuster l'intervalle si nécessaire
        clearInterval(interval)
        setupInterval()
      }, checkInterval())
    }
    
    setupInterval()
    
    return () => clearInterval(interval)
  }, [fetchGameData])

  // Calculer les scores visibles selon l'heure
  const getVisibleScores = useCallback(() => {
    if (!gameState) return {}
    
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTime = currentHour + currentMinutes / 60

    const visibleProgress: Record<string, any> = {}

    Object.entries(gameState.tableProgress).forEach(([tableNumber, progress]) => {
      const visibleTable = {
        tableNumber,
        phases: [...progress.phases],
        totalScore: 0,
        lastActivity: progress.lastActivity,
        currentPhase: progress.currentPhase,
        currentQuestion: progress.currentQuestion
      }

      // Avant 18h30 : aucun score visible
      if (currentTime < 18.5) {
        visibleTable.phases = visibleTable.phases.map((phase: PhaseProgress) => ({
          ...phase,
          score: 0,
          visible: false
        }))
      }
      // Entre 18h30 et 21h30 : uniquement Phase 1 visible
      else if (currentTime >= 18.5 && currentTime < 21.5) {
        visibleTable.phases = visibleTable.phases.map((phase: PhaseProgress, index: number) => ({
          ...phase,
          score: index === 0 ? phase.score : 0,
          visible: index === 0
        }))
        visibleTable.totalScore = visibleTable.phases[0]?.score || 0
      }
      // Entre 21h30 et 22h : Phase 1 + 2 visibles
      else if (currentTime >= 21.5 && currentTime < 22) {
        visibleTable.phases = visibleTable.phases.map((phase: PhaseProgress, index: number) => ({
          ...phase,
          score: index < 2 ? phase.score : 0,
          visible: index < 2
        }))
        const phase1Score = visibleTable.phases[0]?.score || 0
        const phase2Score = visibleTable.phases[1]?.score || 0
        visibleTable.totalScore = phase1Score + phase2Score
      }
      // Après 22h : tous les scores visibles
      else {
        visibleTable.phases = visibleTable.phases.map((phase: PhaseProgress) => ({
          ...phase,
          visible: true
        }))
        visibleTable.totalScore = progress.totalScore
      }

      visibleProgress[tableNumber] = visibleTable
    })

    return visibleProgress
  }, [gameState])

  // Convertir pour la compatibilité avec l'ancien format
  const registeredTables = gameState ? Object.keys(gameState.registeredTables) : []
  const tableProgress = gameState ? gameState.tableProgress : {}

  return {
    registeredTables,
    tableProgress,
    visibleProgress: getVisibleScores(),
    isLoading,
    error,
    registerTable,
    updateProgress,
    completePhase,
    refresh: fetchGameData,
    // Nouvelles propriétés
    leaderboard: gameState?.leaderboard,
    gameConfig: gameState?.gameConfig,
    gameState
  }
}