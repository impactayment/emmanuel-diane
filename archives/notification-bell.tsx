"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/useNotifications"
import type { Notification, NotificationType } from "@/hooks/useNotifications"

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    deleteNotification,
    fetchNotifications 
  } = useNotifications()

  // Animation pour nouvelle notification
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true)
      const timer = setTimeout(() => setHasNewNotification(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  // Icône selon le type de notification
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  // Formater le temps relatif
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return new Date(timestamp).toLocaleDateString("fr-FR")
  }

  // Couleur de fond selon le type
  const getNotificationBg = (type: NotificationType, isRead: boolean) => {
    if (isRead) return "bg-gray-50"
    
    switch (type) {
      case "success":
        return "bg-green-50"
      case "warning":
        return "bg-yellow-50"
      case "error":
        return "bg-red-50"
      default:
        return "bg-blue-50"
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead([notificationId])
  }

  const handleMarkAllAsRead = async () => {
    await markAsRead("all")
  }

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId)
  }

  const handleClearAll = async () => {
    if (confirm("Voulez-vous vraiment supprimer toutes les notifications ?")) {
      await deleteNotification("all")
    }
  }

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 shadow-md transition-all duration-300"
        aria-label="Notifications"
      >
        <Bell className={`w-5 h-5 ${hasNewNotification ? "animate-wiggle" : ""}`} />
        
        {/* Badge de notification */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Panneau de notifications */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panneau */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 max-h-[500px] overflow-hidden">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-rose-500 to-purple-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Actions rapides */}
              {notifications.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                    >
                      <Check className="w-3 h-3 inline mr-1" />
                      Tout marquer comme lu
                    </button>
                  )}
                  <button
                    onClick={handleClearAll}
                    className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" />
                    Tout effacer
                  </button>
                </div>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune notification</p>
                  <p className="text-sm mt-1">Vous êtes à jour !</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${getNotificationBg(notification.type, notification.isRead)}`}
                    >
                      <div className="flex gap-3">
                        {/* Icône */}
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}>
                                {notification.title}
                              </p>
                              <p className={`text-sm mt-1 ${notification.isRead ? "text-gray-500" : "text-gray-600"}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatRelativeTime(notification.timestamp)}
                              </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-1">
                              {!notification.isRead && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                title="Supprimer"
                              >
                                <X className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Badge de priorité si haute */}
                      {notification.priority === "high" && (
                        <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                          Priorité haute
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Styles pour l'animation wiggle */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}