import { useState, useEffect, useCallback } from "react"

interface EventsPersistenceState {
  eventStatuses: Record<string, "upcoming" | "current" | "completed" | "delayed">
  eventVisibility: Record<string, boolean>
  lastUpdated: string
}

export function useEventsPersistence() {
  const [state, setState] = useState<EventsPersistenceState>({
    eventStatuses: {},
    eventVisibility: {},
    lastUpdated: new Date().toISOString()
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger l'état initial depuis le serveur
  const loadState = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Ajouter un timeout de 5 secondes
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort(new Error('Request timeout'))
      }, 5000)
      
      const response = await fetch("/api/events-state", {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement")
      }
      const data = await response.json()
      setState(data)
      setError(null)
    } catch (err: any) {
      // Ne pas logger les erreurs d'abort qui sont des timeouts normaux
      if (err.name === 'AbortError' || err.message === 'Request timeout') {
        setError("Timeout - Vérifiez votre connexion")
      } else {
        console.error("Erreur lors du chargement de l'état:", err)
        setError("Impossible de charger l'état des événements")
      }
      // Définir un état par défaut pour permettre l'utilisation
      setState({
        eventStatuses: {},
        eventVisibility: {},
        lastUpdated: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sauvegarder l'état sur le serveur
  const saveState = useCallback(async (
    eventStatuses?: Record<string, "upcoming" | "current" | "completed" | "delayed">,
    eventVisibility?: Record<string, boolean>
  ) => {
    try {
      const response = await fetch("/api/events-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventStatuses: eventStatuses || state.eventStatuses,
          eventVisibility: eventVisibility || state.eventVisibility
        })
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      const data = await response.json()
      setState(data)
      setError(null)
      return true
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err)
      setError("Impossible de sauvegarder l'état")
      return false
    }
  }, [state])

  // Mettre à jour un statut d'événement
  const updateEventStatus = useCallback(async (
    eventId: string,
    status: "upcoming" | "current" | "completed" | "delayed"
  ) => {
    const newStatuses = {
      ...state.eventStatuses,
      [eventId]: status
    }
    
    // Mise à jour optimiste
    setState(prev => ({
      ...prev,
      eventStatuses: newStatuses,
      lastUpdated: new Date().toISOString()
    }))

    // Sauvegarder sur le serveur
    return await saveState(newStatuses, undefined)
  }, [state.eventStatuses, saveState])

  // Mettre à jour la visibilité d'un événement
  const updateEventVisibility = useCallback(async (
    eventId: string,
    isVisible: boolean
  ) => {
    const newVisibility = {
      ...state.eventVisibility,
      [eventId]: isVisible
    }
    
    // Mise à jour optimiste
    setState(prev => ({
      ...prev,
      eventVisibility: newVisibility,
      lastUpdated: new Date().toISOString()
    }))

    // Sauvegarder sur le serveur
    return await saveState(undefined, newVisibility)
  }, [state.eventVisibility, saveState])

  // Réinitialiser tous les statuts
  const resetAllStatuses = useCallback(async () => {
    setState({
      eventStatuses: {},
      eventVisibility: {},
      lastUpdated: new Date().toISOString()
    })
    
    return await saveState({}, {})
  }, [saveState])

  // Charger l'état au montage
  useEffect(() => {
    loadState()
  }, [loadState])

  return {
    eventStatuses: state.eventStatuses,
    eventVisibility: state.eventVisibility,
    lastUpdated: state.lastUpdated,
    isLoading,
    error,
    updateEventStatus,
    updateEventVisibility,
    resetAllStatuses,
    reloadState: loadState
  }
}