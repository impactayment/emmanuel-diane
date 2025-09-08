"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"

export interface FlashNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number // Durée en millisecondes (par défaut 5000)
}

interface FlashNotificationProps {
  notifications: FlashNotification[]
  onDismiss: (id: string) => void
  soundEnabled?: boolean
  playSound?: (type: "start" | "complete" | "delay" | "notification" | "sync") => void
}

export default function FlashNotificationComponent({ notifications, onDismiss, soundEnabled = true, playSound }: FlashNotificationProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Set<string>>(new Set())

  // Mapper le type de notification vers le type de son du Timeline
  const getSoundType = (notificationType: FlashNotification["type"]) => {
    switch (notificationType) {
      case "success":
        return "complete"
      case "error":
        return "delay" 
      case "warning":
        return "delay"
      case "info":
        return "notification"
      default:
        return "notification"
    }
  }

  useEffect(() => {
    // Afficher les nouvelles notifications
    notifications.forEach(notification => {
      if (!visibleNotifications.has(notification.id)) {
        setVisibleNotifications(prev => new Set(prev).add(notification.id))
        
        // Jouer le son correspondant au type de notification si le son est activé et la fonction est fournie
        if (soundEnabled && playSound) {
          playSound(getSoundType(notification.type))
        }
        
        // Auto-dismiss après la durée spécifiée (par défaut 5 secondes)
        const duration = notification.duration || 5000
        setTimeout(() => {
          onDismiss(notification.id)
          setVisibleNotifications(prev => {
            const newSet = new Set(prev)
            newSet.delete(notification.id)
            return newSet
          })
        }, duration)
      }
    })
  }, [notifications, onDismiss, soundEnabled, playSound])

  const getIcon = (type: FlashNotification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "error":
        return <XCircle className="w-5 h-5" />
      case "warning":
        return <AlertTriangle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type: FlashNotification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white shadow-green-500/50"
      case "error":
        return "bg-red-500 text-white shadow-red-500/50"
      case "warning":
        return "bg-yellow-500 text-white shadow-yellow-500/50"
      case "info":
        return "bg-blue-500 text-white shadow-blue-500/50"
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`
            transform transition-all duration-500 ease-out pointer-events-auto
            ${visibleNotifications.has(notification.id) 
              ? "translate-x-0 opacity-100 scale-100" 
              : "translate-x-full opacity-0 scale-95"}
          `}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className={`
            min-w-[300px] max-w-md rounded-lg shadow-2xl overflow-hidden
            ${getStyles(notification.type)}
            animate-pulse-once
          `}>
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icône animée */}
                <div className="flex-shrink-0 animate-bounce-once">
                  {getIcon(notification.type)}
                </div>
                
                {/* Contenu */}
                <div className="flex-1">
                  <h4 className="font-semibold text-white">
                    {notification.title}
                  </h4>
                  {notification.message && (
                    <p className="mt-1 text-sm text-white/90">
                      {notification.message}
                    </p>
                  )}
                </div>
                
                {/* Bouton fermer */}
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/50 rounded-full animate-shrink"
                  style={{
                    animationDuration: `${notification.duration || 5000}ms`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes pulse-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-4px); }
          75% { transform: translateY(2px); }
        }
        
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.5s ease-in-out;
        }
        
        .animate-shrink {
          animation: shrink linear forwards;
        }
      `}</style>
    </div>
  )
}

// Hook pour gérer les notifications flash
export function useFlashNotifications() {
  const [notifications, setNotifications] = useState<FlashNotification[]>([])

  const addNotification = (
    type: FlashNotification["type"],
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = `flash-${Date.now()}-${Math.random()}`
    const notification: FlashNotification = {
      id,
      type,
      title,
      message,
      duration
    }
    
    setNotifications(prev => [...prev, notification])
    
    // Retourner l'ID pour permettre un dismiss manuel si nécessaire
    return id
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll
  }
}