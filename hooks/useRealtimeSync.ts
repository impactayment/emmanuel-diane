"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SyncData {
  statuses: Record<string, "upcoming" | "current" | "completed" | "delayed">
  visibility: Record<string, boolean> // true = public, false = privé
  lastUpdated: number
}

export function useRealtimeSync() {
  const [syncData, setSyncData] = useState<SyncData>({ statuses: {}, visibility: {}, lastUpdated: 0 })
  const [isOnline, setIsOnline] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)
  const lastSyncRef = useRef<number>(0)
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fonction pour synchroniser avec le serveur
  const syncWithServer = useCallback(async (force = false) => {
    try {
      setSyncError(null)

      const response = await fetch("/api/timeline-status", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Erreur de synchronisation: ${response.status}`)
      }

      const data: SyncData = await response.json()

      // Ne mettre à jour que si les données sont plus récentes
      if (force || data.lastUpdated > lastSyncRef.current) {
        setSyncData(data)
        lastSyncRef.current = data.lastUpdated
      }

      setIsOnline(true)
    } catch (error) {
      console.error("Erreur de synchronisation:", error)
      setSyncError(error instanceof Error ? error.message : "Erreur de connexion")
      setIsOnline(false)
    }
  }, [])

  // Fonction pour mettre à jour un statut
  const updateEventStatus = useCallback(
    async (eventId: string, status: "upcoming" | "current" | "completed" | "delayed") => {
      const timestamp = Date.now()

      try {
        // Mise à jour optimiste locale
        setSyncData((prev) => ({
          ...prev,
          statuses: { ...prev.statuses, [eventId]: status },
          lastUpdated: timestamp,
        }))

        // Envoyer au serveur
        const response = await fetch("/api/timeline-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId, status, timestamp }),
        })

        if (!response.ok) {
          throw new Error(`Erreur de mise à jour: ${response.status}`)
        }

        const data = await response.json()

        // Confirmer avec les données du serveur
        setSyncData({
          statuses: data.statuses,
          visibility: data.visibility || {},
          lastUpdated: data.lastUpdated,
        })

        lastSyncRef.current = data.lastUpdated
        setIsOnline(true)
        setSyncError(null)

        return true
      } catch (error) {
        console.error("Erreur de mise à jour:", error)
        setSyncError(error instanceof Error ? error.message : "Erreur de mise à jour")
        setIsOnline(false)

        // Revert en cas d'erreur
        await syncWithServer(true)
        return false
      }
    },
    [syncWithServer],
  )

  // Démarrer la synchronisation périodique
  useEffect(() => {
    // Synchronisation initiale
    syncWithServer(true)

    // Synchronisation plus fréquente si activité récente
    const checkRecentActivity = () => {
      const now = Date.now()
      if (now - lastSyncRef.current < 30000) {
        return 2000
      }
      return 3000
    }

    const scheduleNextSync = () => {
      if (syncIntervalRef.current) {
        clearTimeout(syncIntervalRef.current)
      }
      syncIntervalRef.current = setTimeout(() => {
        syncWithServer()
        scheduleNextSync()
      }, checkRecentActivity())
    }

    scheduleNextSync()

    // Synchronisation lors du focus de la fenêtre
    const handleFocus = () => syncWithServer(true)
    const handleOnline = () => {
      setIsOnline(true)
      syncWithServer(true)
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("focus", handleFocus)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      if (syncIntervalRef.current) {
        clearTimeout(syncIntervalRef.current)
      }
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [syncWithServer])

  // Fonction pour mettre à jour la visibilité
  const updateEventVisibility = useCallback(
    async (eventId: string, isPublic: boolean) => {
      const timestamp = Date.now()

      try {
        // Mise à jour optimiste locale
        setSyncData((prev) => ({
          ...prev,
          visibility: { ...prev.visibility, [eventId]: isPublic },
          lastUpdated: timestamp,
        }))

        // Envoyer au serveur
        const response = await fetch("/api/timeline-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId, visibility: isPublic, timestamp }),
        })

        if (!response.ok) {
          throw new Error(`Erreur de mise à jour: ${response.status}`)
        }

        const data = await response.json()

        // Confirmer avec les données du serveur
        setSyncData({
          statuses: data.statuses,
          visibility: data.visibility || {},
          lastUpdated: data.lastUpdated,
        })

        lastSyncRef.current = data.lastUpdated
        setIsOnline(true)
        setSyncError(null)

        return true
      } catch (error) {
        console.error("Erreur de mise à jour:", error)
        setSyncError(error instanceof Error ? error.message : "Erreur de mise à jour")
        setIsOnline(false)

        // Revert en cas d'erreur
        await syncWithServer(true)
        return false
      }
    },
    [syncWithServer],
  )

  // Fonction pour réinitialiser tous les statuts
  const resetAllStatuses = useCallback(async () => {
    const timestamp = Date.now()
    
    try {
      // Réinitialiser localement
      setSyncData((prev) => ({
        ...prev,
        statuses: {}, // Vider tous les statuts
        lastUpdated: timestamp,
      }))
      
      // Envoyer au serveur
      const response = await fetch("/api/timeline-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetAll: true, timestamp }),
      })
      
      if (!response.ok) {
        throw new Error(`Erreur de réinitialisation: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Confirmer avec les données du serveur
      setSyncData({
        statuses: data.statuses || {},
        visibility: data.visibility || {},
        lastUpdated: data.lastUpdated,
      })
      
      lastSyncRef.current = data.lastUpdated
      setIsOnline(true)
      setSyncError(null)
      
      return true
    } catch (error) {
      console.error("Erreur de réinitialisation:", error)
      setSyncError(error instanceof Error ? error.message : "Erreur de réinitialisation")
      setIsOnline(false)
      return false
    }
  }, [])

  return {
    eventStatuses: syncData.statuses,
    eventVisibility: syncData.visibility,
    lastUpdated: syncData.lastUpdated,
    updateEventStatus,
    updateEventVisibility,
    syncWithServer,
    isOnline,
    syncError,
    resetAllStatuses,
  }
}
