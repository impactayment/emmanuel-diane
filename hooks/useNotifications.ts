"use client"

import { useState, useEffect, useCallback } from "react"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  isRead: boolean
  eventId?: string
  priority?: "low" | "medium" | "high"
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

export function useNotifications() {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  })

  // Récupérer les notifications
  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const params = new URLSearchParams()
      if (unreadOnly) params.append("unread", "true")
      params.append("limit", "50")
      
      const response = await fetch(`/api/notifications?${params}`)
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }
      
      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        notifications: data.notifications,
        unreadCount: data.unreadCount,
        isLoading: false,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erreur de chargement",
      }))
    }
  }, [])

  // Créer une nouvelle notification
  const createNotification = useCallback(async (
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      eventId?: string
      priority?: "low" | "medium" | "high"
    }
  ) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          message,
          ...options,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }
      
      const data = await response.json()
      
      // Ajouter la nouvelle notification en début de liste
      setState(prev => ({
        ...prev,
        notifications: [data.notification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1,
      }))
      
      return data.notification
    } catch (error) {
      console.error("Erreur création notification:", error)
      return null
    }
  }, [])

  // Marquer comme lu
  const markAsRead = useCallback(async (notificationIds: string[] | "all") => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markAllAsRead: notificationIds === "all",
          notificationIds: notificationIds === "all" ? undefined : notificationIds,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }
      
      // Mettre à jour l'état local
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => {
          if (notificationIds === "all" || notificationIds.includes(n.id)) {
            return { ...n, isRead: true }
          }
          return n
        }),
        unreadCount: notificationIds === "all" ? 0 : Math.max(0, prev.unreadCount - notificationIds.length),
      }))
      
      return true
    } catch (error) {
      console.error("Erreur marquage notification:", error)
      return false
    }
  }, [])

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string | "all") => {
    try {
      const params = new URLSearchParams()
      if (notificationId === "all") {
        params.append("clearAll", "true")
      } else {
        params.append("id", notificationId)
      }
      
      const response = await fetch(`/api/notifications?${params}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }
      
      // Mettre à jour l'état local
      if (notificationId === "all") {
        setState(prev => ({
          ...prev,
          notifications: [],
          unreadCount: 0,
        }))
      } else {
        setState(prev => {
          const notification = prev.notifications.find(n => n.id === notificationId)
          return {
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification && !notification.isRead ? prev.unreadCount - 1 : prev.unreadCount,
          }
        })
      }
      
      return true
    } catch (error) {
      console.error("Erreur suppression notification:", error)
      return false
    }
  }, [])

  // Charger les notifications au montage
  useEffect(() => {
    fetchNotifications()
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Écouter les changements de focus pour rafraîchir
  useEffect(() => {
    const handleFocus = () => {
      fetchNotifications()
    }
    
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [fetchNotifications])

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    fetchNotifications,
    createNotification,
    markAsRead,
    deleteNotification,
  }
}