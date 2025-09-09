"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Users,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  CheckCircle,
  AlertCircle,
  Play,
  AlertTriangle,
  Bell,
  X,
  Volume2,
  VolumeX,
  Shield,
  Wifi,
  WifiOff,
  GamepadIcon,
} from "lucide-react"
import { useRealtimeSync } from "@/hooks/useRealtimeSync"
import { useWeather } from "@/hooks/useWeather"
import { useEventsPersistence } from "@/hooks/useEventsPersistence"
import { allEventsData } from "./timeline-events"
import WeddingGame from "./wedding-game-v2"

interface TimelineEvent {
  id: string
  time: string
  originalTime?: string
  event: string
  location: string
  duration: string
  type: string
  isPublic: boolean
  weather?: {
    condition: string
    temperature: number
    icon: string
  }
  status?: "upcoming" | "current" | "completed" | "delayed" | "soon"
  isOutdoor?: boolean
  delay?: {
    newTime: string
    reason: string
    delayMinutes: number
    notified: boolean
  }
  autoAdjusted?: boolean
  suggestedTime?: string
}

interface Notification {
  id: string
  message: string
  type: "delay" | "update" | "adjustment" | "sync"
  timestamp: Date
  expiresAt: Date
}

type AccessLevel = "guest" | "authenticated"

export default function Timeline() {
  const [activeTab, setActiveTab] = useState<"guests" | "private">("guests")
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("guest")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showGame, setShowGame] = useState(false)
  const [isOnline, setIsOnline] = useState(true) // État de connexion
  const [localEventStatuses, setLocalEventStatuses] = useState<Record<string, string>>({}) // Statuts locaux pour l'affichage

  // Hook de persistance des événements
  const { 
    eventStatuses, 
    eventVisibility, 
    lastUpdated, 
    updateEventStatus: updateEventStatusPersistence, 
    updateEventVisibility: updateEventVisibilityPersistence,
    resetAllStatuses,
    reloadState,
    isLoading: isPersistenceLoading,
    error: persistenceError
  } = useEventsPersistence()
  
  // Hook pour la météo en temps réel
  const { temperature, weatherEmoji, getWeatherForTime, loading: weatherLoading } = useWeather()

  const ACCESS_PASSWORD = "ED2025"
  const NOTIFICATION_DURATION = 5000 // 5 secondes

  // Wrappers pour les fonctions de mise à jour avec persistance
  const updateEventStatus = async (eventId: string, status: "upcoming" | "current" | "completed" | "delayed") => {
    const success = await updateEventStatusPersistence(eventId, status)
    setIsOnline(success)
    return success
  }

  const updateEventVisibility = async (eventId: string, isVisible: boolean) => {
    const success = await updateEventVisibilityPersistence(eventId, isVisible)
    setIsOnline(success)
    return success
  }

  // Fonction pour créer un contexte audio
  const createAudioContext = () => {
    if (typeof window !== "undefined") {
      return new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return null
  }

  // Fonctions pour jouer différents sons
  const playSound = (type: "start" | "complete" | "delay" | "notification" | "sync") => {
    if (!soundEnabled) return

    const audioContext = createAudioContext()
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (type) {
      case "start":
        // Son de démarrage - fréquence montante
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case "complete":
        // Son de succès - accord majeur
        const frequencies = [523.25, 659.25, 783.99] // Do, Mi, Sol
        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()

          osc.connect(gain)
          gain.connect(audioContext.destination)

          osc.frequency.setValueAtTime(freq, audioContext.currentTime)
          gain.gain.setValueAtTime(0.05, audioContext.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

          osc.start(audioContext.currentTime + index * 0.1)
          osc.stop(audioContext.currentTime + 0.5 + index * 0.1)
        })
        break

      case "delay":
        // Son d'alerte - bips répétés
        for (let i = 0; i < 3; i++) {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()

          osc.connect(gain)
          gain.connect(audioContext.destination)

          osc.frequency.setValueAtTime(800, audioContext.currentTime + i * 0.2)
          gain.gain.setValueAtTime(0.1, audioContext.currentTime + i * 0.2)
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.2 + 0.1)

          osc.start(audioContext.currentTime + i * 0.2)
          osc.stop(audioContext.currentTime + i * 0.2 + 0.1)
        }
        break

      case "sync":
        // Son de synchronisation - bip doux
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.15)
        break

      case "notification":
        // Son de notification - bip simple
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break
    }
  }

  useEffect(() => {
    // Initialiser l'heure côté client uniquement
    setCurrentTime(new Date())
    
    // Timer pour mettre à jour l'heure actuelle
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Mise à jour chaque seconde pour afficher les secondes
    
    // Vérifier si on doit réinitialiser les statuts (nouveau jour)
    const checkAndResetStatuses = () => {
      const lastResetDate = localStorage.getItem('lastStatusResetDate')
      const today = new Date().toDateString()
      
      if (lastResetDate !== today) {
        // Réinitialiser tous les statuts
        if (resetAllStatuses) {
          resetAllStatuses()
        }
        // Sauvegarder la date de réinitialisation
        localStorage.setItem('lastStatusResetDate', today)
      }
    }
    
    checkAndResetStatuses()

    return () => clearInterval(timer)
  }, [])

  // Effet pour nettoyer les notifications expirées
  useEffect(() => {
    const checkNotificationExpiry = () => {
      const now = new Date()
      setNotifications((prev) => prev.filter((notification) => notification.expiresAt > now))
    }

    const timer = setInterval(checkNotificationExpiry, 1000)
    return () => clearInterval(timer)
  }, [])

  // Effet pour détecter les changements de statut synchronisés
  useEffect(() => {
    // Détecter les changements depuis la dernière synchronisation
    const now = Date.now()
    if (lastUpdated > 0 && now - lastUpdated < 5000) {
      // Changement récent (moins de 5s) - probablement d'un autre appareil
      const timeDiff = Math.floor((now - lastUpdated) / 1000)
      if (timeDiff > 0) {
        addNotification(`🔄 Mise à jour automatique reçue (il y a ${timeDiff}s)`, "sync", false)
        playSound("sync")
      }
    }
  }, [lastUpdated])

  // Effet pour mettre à jour automatiquement les statuts des événements
  useEffect(() => {
    updateEventStatusesAutomatically()
  }, [currentTime])

  // Effet pour mettre à jour l'état de connexion basé sur les erreurs
  useEffect(() => {
    setIsOnline(!persistenceError)
  }, [persistenceError])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ACCESS_PASSWORD) {
      setAccessLevel("authenticated")
      setPasswordError("")
      setPassword("")
      setShowPasswordModal(false)
      setActiveTab("private") // Basculer automatiquement vers le programme privé
      addNotification("🔑 Accès authentifié - Programme privé déverrouillé", "update", false)
      playSound("notification")
    } else {
      setPasswordError("Mot de passe incorrect")
      setPassword("")
      playSound("delay")
    }
  }

  const handlePrivateTabClick = () => {
    // Si l'utilisateur n'est pas authentifié, demander le mot de passe
    if (accessLevel === "guest") {
      setShowPasswordModal(true)
      setPasswordError("")
    } else {
      // Si déjà authentifié, basculer vers le programme privé
      setActiveTab("private")
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) {
      playSound("notification") // Test du son quand on l'active
    }
  }

  const canModifyEvent = (eventTime: string): boolean => {
    // Les utilisateurs authentifiés peuvent modifier n'importe quel événement
    if (accessLevel === "authenticated") {
      return true
    }

    if (!currentTime) return false
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    // Convertir l'heure de l'événement en minutes
    const [hour, min] = eventTime.split("h").map((n) => Number.parseInt(n) || 0)
    const eventTimeInMinutes = hour * 60 + min

    // Les non-authentifiés ne peuvent pas modifier les événements passés
    return eventTimeInMinutes >= currentTimeInMinutes - 15
  }

  const hasPermissionToModify = (eventId: string): boolean => {
    // Seuls les utilisateurs authentifiés dans le programme privé peuvent modifier les statuts
    return accessLevel === "authenticated" && activeTab === "private"
  }

  // Fonction helper pour convertir une durée en minutes
  const parseDuration = (duration: string): number => {
    if (duration.includes("h")) {
      const [hours, minutes] = duration.replace("min", "").split("h").map(n => Number.parseInt(n) || 0)
      return hours * 60 + minutes
    } else {
      return Number.parseInt(duration.replace("min", "")) || 0
    }
  }

  const getEventTimeStatus = (eventTime: string, eventId?: string): "past" | "current" | "soon" | "upcoming" => {
    if (!currentTime) return "upcoming"
    
    // Mode simulation : Si on a le param\u00e8tre URL ?simulate=true, on simule le jour du mariage
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const isSimulating = urlParams?.get('simulate') === 'true'
    
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    const [hour, min] = eventTime.split("h").map((n) => Number.parseInt(n) || 0)
    const eventStartInMinutes = hour * 60 + min
    
    // DEBUG: Log pour comprendre le problème  
    if (eventId === "ceremony-1" || eventId === "dinner-1" || eventId === "party-1") {
      console.log(`Event ${eventId} at ${eventTime}:`, {
        currentHour,
        eventHour: hour,
        isAfterMidnight: currentHour < 6,
        isDayEvent: hour >= 6,
        shouldBePast: currentHour < 6 && hour >= 6
      })
    }
    
    // Trouver la durée de l'événement
    let eventDurationInMinutes = 15 // Durée par défaut si non trouvée
    if (eventId) {
      const event = allEventsData.find(e => e.id === eventId)
      if (event && event.duration) {
        eventDurationInMinutes = parseDuration(event.duration)
      }
    }
    
    const eventEndInMinutes = eventStartInMinutes + eventDurationInMinutes
    
    // Déterminer si on n'a pas encore commencé le programme
    const currentEvents = getCurrentEvents()
    const sortedEvents = [...currentEvents].sort((a, b) => {
      const [hourA, minA] = a.time.split("h").map((n) => Number.parseInt(n) || 0)
      const [hourB, minB] = b.time.split("h").map((n) => Number.parseInt(n) || 0)
      const timeA = hourA * 60 + minA
      const timeB = hourB * 60 + minB
      // Gérer les événements nocturnes
      const adjustedTimeA = timeA < 360 ? timeA + 1440 : timeA // Si avant 6h, considérer comme J+1
      const adjustedTimeB = timeB < 360 ? timeB + 1440 : timeB
      return adjustedTimeA - adjustedTimeB
    })
    
    // Trouver le premier événement de la journée (pas nocturne)
    const firstDayEvent = sortedEvents.find(e => {
      const [h] = e.time.split("h").map((n) => Number.parseInt(n) || 0)
      return h >= 6 // Événements à partir de 6h du matin
    })
    
    if (firstDayEvent) {
      const [firstHour, firstMin] = firstDayEvent.time.split("h").map((n) => Number.parseInt(n) || 0)
      const firstEventTime = firstHour * 60 + firstMin
      
      // Si on n'a pas encore commencé le premier événement du jour
      // MAIS attention: si on est après minuit (00h00-05h59), ne pas traiter les événements de la journée précédente comme "upcoming"
      if (currentTimeInMinutes < firstEventTime && currentHour >= 6) {
        // On est dans la journée et pas encore au premier événement
        // Vérifier si on est proche du premier événement
        const timeDiff = firstEventTime - currentTimeInMinutes
        if (timeDiff > 0 && timeDiff <= 30) {
          return "soon"
        }
        return "upcoming"
      }
    }
    
    // NOUVELLE LOGIQUE DÉFINITIVE avec calcul de durée
    
    // Traiter les événements nocturnes (00h00-05h59)
    if (hour < 6) { // Événement nocturne
      if (currentHour < 6) {
        // On est aussi dans la nuit, utiliser la logique avec durée
        if (eventEndInMinutes < currentTimeInMinutes) {
          return "past" // L'événement est complètement terminé
        } else if (currentTimeInMinutes >= eventStartInMinutes && currentTimeInMinutes < eventEndInMinutes) {
          return "current" // On est pendant l'événement
        } else if (eventStartInMinutes > currentTimeInMinutes && eventStartInMinutes <= currentTimeInMinutes + 30) {
          return "soon" // L'événement commence dans les 30 prochaines minutes
        } else {
          return "upcoming" // L'événement est plus tard
        }
      } else {
        // On est dans la journée, l'événement nocturne est à venir
        return "upcoming"
      }
    }

    // Pour les événements de journée (6h00-23h59)
    // Si on est après minuit (00h00-05h59), tous les événements de jour sont passés
    if (currentHour < 6 && hour >= 6) {
      // On est après minuit et l'événement est de la journée précédente
      return "past"
    }
    
    // Sinon, logique normale pour les événements de journée
    if (eventEndInMinutes < currentTimeInMinutes) {
      return "past" // L'événement est complètement terminé
    } else if (currentTimeInMinutes >= eventStartInMinutes && currentTimeInMinutes < eventEndInMinutes) {
      return "current" // On est pendant l'événement (ENTRE début et fin)
    } else if (eventStartInMinutes > currentTimeInMinutes && eventStartInMinutes <= currentTimeInMinutes + 30) {
      return "soon" // L'événement commence dans les 30 prochaines minutes  
    } else {
      return "upcoming" // L'événement est plus tard
    }
  }

  // Fonction pour trouver l'événement actuel dans un programme
  const findCurrentEvent = (events: TimelineEvent[]): TimelineEvent | null => {
    // Trier les événements par heure
    const sortedEvents = [...events].sort((a, b) => {
      const [hourA, minA] = a.time.split("h").map((n) => Number.parseInt(n) || 0)
      const [hourB, minB] = b.time.split("h").map((n) => Number.parseInt(n) || 0)
      return hourA * 60 + minA - (hourB * 60 + minB)
    })

    // Trouver l'événement actuel (dans la fenêtre de ±2 minutes seulement)
    const currentEvent = sortedEvents.find((event) => getEventTimeStatus(event.time, event.id) === "current")

    // Retourner l'événement actuel seulement s'il existe
    return currentEvent || null
  }

  // Fonction pour mettre à jour automatiquement les statuts des événements (LOCAL SEULEMENT)
  const updateEventStatusesAutomatically = () => {
    // Mettre à jour les statuts pour les deux programmes
    const allEvents = [...guestEvents, ...privateEvents]
    const newLocalStatuses: Record<string, string> = {}

    // Traiter chaque programme séparément
    const processProgram = (programEvents: TimelineEvent[]) => {
      let hasCurrentEvent = false
      let nextEventMarkedAsSoon = false

      for (let i = 0; i < programEvents.length; i++) {
        const event = programEvents[i]
        const timeStatus = getEventTimeStatus(event.time, event.id)
        const savedStatus = eventStatuses[event.id]
        
        // Si l'admin a défini un statut manuel (delayed), le respecter
        if (savedStatus === "delayed") {
          newLocalStatuses[event.id] = "delayed"
        } else {
          // Utiliser le statut automatique basé sur l'heure
          if (timeStatus === "past") {
            newLocalStatuses[event.id] = "completed"
          } else if (timeStatus === "current") {
            newLocalStatuses[event.id] = "current"
            hasCurrentEvent = true
            nextEventMarkedAsSoon = false // Reset pour marquer le prochain
          } else {
            // Pour les événements futurs
            if (hasCurrentEvent && !nextEventMarkedAsSoon) {
              // C'est le premier événement futur après un événement en cours
              newLocalStatuses[event.id] = "soon"
              nextEventMarkedAsSoon = true
            } else if (!hasCurrentEvent && i === 0) {
              // Pas d'événement en cours, vérifier si c'est le premier futur proche (< 30 min)
              if (timeStatus === "soon") {
                newLocalStatuses[event.id] = "soon"
              } else {
                newLocalStatuses[event.id] = "upcoming"
              }
            } else {
              newLocalStatuses[event.id] = "upcoming"
            }
          }
        }
      }
    }

    // Traiter le programme des invités
    processProgram(guestEvents)
    
    // Traiter le programme privé
    processProgram(privateEvents)

    setLocalEventStatuses(newLocalStatuses)
  }

  // Fonction pour obtenir le statut d'un événement
  const getEventStatus = (eventKey: string, eventTime: string): "upcoming" | "current" | "completed" | "delayed" | "soon" => {
    // PRIORITÉ ABSOLUE: Logique temporelle - TOUJOURS vérifier le temps d'abord
    const timeStatus = getEventTimeStatus(eventTime, eventKey)
    
    // Si l'événement est futur, il ne peut JAMAIS être "completed"
    if (timeStatus === "upcoming") {
      return "upcoming"
    }
    
    // Si l'événement est en cours, il ne peut pas être "completed"
    if (timeStatus === "current") {
      return "current"
    }
    
    // Si l'événement est bientôt, il ne peut pas être "completed"
    if (timeStatus === "soon") {
      return "soon"
    }
    
    // Seulement pour les événements passés, utiliser le statut sauvegardé ou retourner "completed"
    if (timeStatus === "past") {
      const savedStatus = eventStatuses[eventKey]
      // Vérifier si l'admin a manuellement marqué comme "delayed"
      if (savedStatus === "delayed") {
        return "delayed"
      }
      // Par défaut, un événement passé est terminé
      return "completed"
    }
    
    // Fallback par défaut
    return "upcoming"
  }

  const handleUpdateEventStatus = async (
    eventKey: string,
    status: "upcoming" | "current" | "completed" | "delayed",
  ) => {
    if (!hasPermissionToModify(eventKey)) {
      addNotification(`🔒 Accès refusé : Vous devez être authentifié pour modifier les statuts`, "update", false)
      setShowPasswordModal(true)
      playSound("delay")
      return
    }

    const event = getCurrentEvents().find((e) => e.id === eventKey)
    if (!event) {
      return
    }
    
    if (!canModifyEvent(event.time)) {
      addNotification("⏰ Impossible de modifier : Cet événement est déjà passé", "update", false)
      playSound("delay")
      return
    }

    // Si on marque un événement comme "en cours", réinitialiser les autres événements "en cours" du même programme
    if (status === "current") {
      const eventsToUpdate = activeTab === "guests" ? guestEvents : privateEvents

      for (const e of eventsToUpdate) {
        if (e.id !== eventKey && eventStatuses[e.id] === "current") {
          await updateEventStatus(e.id, "upcoming")
        }
      }
    }

    // Mettre à jour le statut principal
    const success = await updateEventStatus(eventKey, status)

    if (success) {
      const statusText = {
        current: "en cours",
        completed: "terminé",
        delayed: "retardé",
        upcoming: "à venir",
      }[status]

      // Ne notifier que pour les statuts non-terminés
      if (status !== "completed") {
        addNotification(`✅ ${event?.event} marqué comme ${statusText}`, "update", event && !event.isPublic)
      }

      // Jouer le son approprié selon le statut
      switch (status) {
        case "current":
          playSound("start")
          break
        case "completed":
          playSound("complete")
          break
        case "delayed":
          playSound("delay")
          break
        default:
          playSound("notification")
      }
    }
  }

  const addNotification = (message: string, type: "delay" | "update" | "adjustment" | "sync", isPrivate: boolean = false) => {
    // Ne pas afficher les notifications privées si l'utilisateur n'est pas authentifié
    if (isPrivate && accessLevel !== "authenticated") {
      return
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + NOTIFICATION_DURATION)

    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: now,
      expiresAt,
    }

    // Limiter à 3 notifications maximum
    setNotifications((prev) => [notification, ...prev.slice(0, 2)])

    // Jouer le son de notification
    if (type === "delay") {
      playSound("delay")
    } else if (type === "sync") {
      playSound("sync")
    } else {
      playSound("notification")
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getCurrentEvents = (): TimelineEvent[] => {
    return activeTab === "guests" ? guestEvents : privateEvents
  }

  const getDisplayTime = (event: TimelineEvent): string => {
    return event.time
  }

  const getAccessLevelInfo = () => {
    switch (accessLevel) {
      case "authenticated":
        return {
          icon: <Shield className="w-4 h-4" />,
          text: "Authentifié",
          color: "bg-green-100 text-green-700",
          description: "Contrôle complet des deux programmes",
        }
      default:
        return {
          icon: <Users className="w-4 h-4" />,
          text: "Invité",
          color: "bg-gray-100 text-gray-600",
          description: "Lecture seule",
        }
    }
  }

  // Fonction pour créer les événements avec la météo appropriée
  const createEventWithWeather = (eventData: Omit<TimelineEvent, 'weather'>) => {
    const weatherData = getWeatherForTime(eventData.time)
    return {
      ...eventData,
      weather: {
        condition: "current",
        temperature: weatherData.temperature,
        icon: weatherData.weatherEmoji
      }
    }
  }

  // Mapping pour améliorer l'affichage du programme invités
  const guestEventMapping: Record<string, { title: string; description: string; emoji: string }> = {
    "ceremony-1": {
      emoji: "🌸",
      title: "Accueil chaleureux des invités",
      description: "Installation selon le plan de table avec cocktail de bienvenue"
    },
    "ceremony-2": {
      emoji: "💑",
      title: "Entrée solennelle d'Emmanuel & Diane",
      description: "Entrée majestueuse accompagnés de leurs parents"
    },
    "ceremony-3": {
      emoji: "⛪",
      title: "Cérémonie religieuse",
      description: "Prière d'ouverture et bénédiction par le Pasteur Ngarukiye"
    },
    "ceremony-4": {
      emoji: "💍",
      title: "Échange des vœux et des alliances",
      description: "Moment émouvant avec enseignement du Pasteur Corneil"
    },
    "reception-1": {
      emoji: "🥂",
      title: "Vin d'honneur festif",
      description: "Cocktail raffiné avec animations dans l'espace cocktail"
    },
    "photo-1": {
      emoji: "📸",
      title: "Séance photos souvenirs au parc",
      description: "Photos couple et familles dans le parc adjacent"
    },
    "photo-2": {
      emoji: "📸",
      title: "Séance photo avec tous les invités",
      description: "Photos par tables dans la salle"
    },
    "evening-1": {
      emoji: "✨",
      title: "Grande entrée - Nouvelle tenue",
      description: "Entrée spectaculaire d'Emmanuel & Diane en nouvelle tenue"
    },
    "evening-2": {
      emoji: "💬",
      title: "Discours des familles",
      description: "Messages touchants de Nadine et Divine"
    },
    "dinner-1": {
      emoji: "🍽️",
      title: "Dîner de gala",
      description: "Buffet avec service par tables"
    },
    "gifts-1": {
      emoji: "🎁",
      title: "Partage des cadeaux",
      description: "Remise des cadeaux aux mariés avec photos souvenirs"
    },
    "speech-1": {
      emoji: "💬",
      title: "Discours d'Emmanuel & Diane",
      description: "Remerciements émouvants et annonce du gâteau"
    },
    "cake-1": {
      emoji: "🎂",
      title: "La pièce montée",
      description: "Découpe traditionnelle et service du dessert"
    },
    "party-1": {
      emoji: "💃",
      title: "Ouverture du bal",
      description: "Première danse des mariés suivie de la soirée dansante"
    },
    "end-1": {
      emoji: "🌙",
      title: "Fin des festivités",
      description: "Remerciements finaux et clôture de la célébration"
    }
  }

  // Fonction pour transformer l'événement pour l'affichage invités
  const transformEventForGuest = (event: TimelineEvent): TimelineEvent => {
    const mapping = guestEventMapping[event.id]
    if (mapping) {
      return {
        ...event,
        event: `${mapping.emoji} ${mapping.title}`,
        details: mapping.description
      }
    }
    // Pour les événements publics sans mapping, retourner tel quel
    return event
  }

  // Créer tous les événements avec la météo
  const allEvents: TimelineEvent[] = allEventsData.map(event => createEventWithWeather(event))
  
  // Filtrer les événements selon le tab actif et la visibilité mise à jour
  const guestEvents = allEvents.filter(event => {
    // Si la visibilité a été modifiée, utiliser cette valeur, sinon utiliser la valeur par défaut
    const isPublic = eventVisibility[event.id] !== undefined ? eventVisibility[event.id] : event.isPublic
    return isPublic
  }).map(transformEventForGuest) // Transformer pour l'affichage invités
  
  const privateEvents = allEvents // Le programme privé voit tous les événements sans transformation

  const getEventColor = (type: string) => {
    switch (type) {
      case "ceremony":
        return "bg-purple-500"
      case "photo":
        return "bg-pink-500"
      case "reception":
        return "bg-rose-500"
      case "entertainment":
        return "bg-orange-500"
      case "preparation":
        return "bg-blue-500"
      case "transport":
        return "bg-green-500"
      case "arrival":
        return "bg-indigo-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "ceremony":
        return "💒"
      case "photo":
        return "📸"
      case "reception":
        return "🍽️"
      case "entertainment":
        return "💃"
      case "preparation":
        return "💄"
      case "transport":
        return "🚗"
      case "arrival":
        return "👋"
      default:
        return "⏰"
    }
  }

  const getStatusIcon = (status: "upcoming" | "current" | "completed" | "delayed" | "soon") => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "current":
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />
      case "delayed":
        return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
      case "soon":
        return <Bell className="w-4 h-4 text-orange-500 animate-pulse" />
      case "upcoming":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getCurrentTimePosition = () => {
    if (!currentTime) return "À VENIR"
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    const currentEvents = getCurrentEvents()

    // Trier les événements par heure en gérant les événements nocturnes
    const sortedEvents = [...currentEvents].sort((a, b) => {
      const [hourA, minA] = a.time.split("h").map((n) => Number.parseInt(n) || 0)
      const [hourB, minB] = b.time.split("h").map((n) => Number.parseInt(n) || 0)
      const timeA = hourA * 60 + minA
      const timeB = hourB * 60 + minB
      // Si un événement est après minuit (0-5h), le considérer comme étant après tous les autres
      const adjustedTimeA = hourA < 6 ? timeA + 1440 : timeA
      const adjustedTimeB = hourB < 6 ? timeB + 1440 : timeB
      return adjustedTimeA - adjustedTimeB
    })

    if (sortedEvents.length === 0) return null

    // Obtenir le premier événement de jour (pas nocturne)
    const firstDayEvent = sortedEvents.find(e => {
      const [h] = e.time.split("h").map((n) => Number.parseInt(n) || 0)
      return h >= 6
    })
    
    if (!firstDayEvent) return null
    
    const [firstEventHour, firstEventMin] = firstDayEvent.time.split("h").map((n) => Number.parseInt(n) || 0)
    const firstEventTime = firstEventHour * 60 + firstEventMin
    
    // Ne jamais afficher avant le premier événement du jour
    if (currentTimeInMinutes < firstEventTime) {
      return null
    }
    
    // NOUVELLE LOGIQUE : Synchronisée avec le badge MAINTENANT
    // Calculer la position basée sur la progression DANS l'événement actuel
    let cumulativePosition = 0
    
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i]
      const [hour, min] = event.time.split("h").map((n) => Number.parseInt(n) || 0)
      const eventStartInMinutes = hour * 60 + min
      const eventDurationInMinutes = parseDuration(event.duration)
      const eventEndInMinutes = eventStartInMinutes + eventDurationInMinutes
      
      // Hauteur proportionnelle de chaque événement dans la timeline
      const eventHeightPercent = 100 / sortedEvents.length
      
      if (currentTimeInMinutes >= eventStartInMinutes && currentTimeInMinutes < eventEndInMinutes) {
        // On est DANS cet événement - calculer la progression exacte
        const elapsedInEvent = currentTimeInMinutes - eventStartInMinutes
        const progressInEvent = (elapsedInEvent / eventDurationInMinutes)
        
        // Position = position cumulée des événements passés + progression dans l'événement actuel
        return cumulativePosition + (progressInEvent * eventHeightPercent)
      } else if (currentTimeInMinutes >= eventEndInMinutes) {
        // Cet événement est complètement passé
        cumulativePosition += eventHeightPercent
      } else {
        // On n'a pas encore atteint cet événement
        break
      }
    }
    
    // Si on est après tous les événements
    return Math.min(100, cumulativePosition)
  }

  const currentTimePosition = getCurrentTimePosition()
  const accessInfo = getAccessLevelInfo()
  
  // Nouvelle logique unifiée : UN SEUL badge à la fois avec progression
  const getEventIndicator = (): { badge: "MAINTENANT" | "BIENTÔT", eventId: string, progress: number } | null => {
    if (!currentTime) return null
    const events = getCurrentEvents()
    const now = currentTime
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute
    
    // Trouver l'événement en cours
    let currentEventIndex = -1
    let currentEvent: TimelineEvent | null = null
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      const [hour, min] = event.time.split("h").map(n => Number.parseInt(n) || 0)
      const eventStartInMinutes = hour * 60 + min
      const eventDurationInMinutes = parseDuration(event.duration)
      const eventEndInMinutes = eventStartInMinutes + eventDurationInMinutes
      
      // L'événement est en cours
      if (currentTimeInMinutes >= eventStartInMinutes && currentTimeInMinutes < eventEndInMinutes) {
        currentEvent = event
        currentEventIndex = i
        
        // Calculer la progression dans l'événement (0 à 100%)
        const elapsedInEvent = currentTimeInMinutes - eventStartInMinutes
        const progressPercent = (elapsedInEvent / eventDurationInMinutes) * 100
        
        // Calculer le temps restant jusqu'à la fin
        const minutesUntilEnd = eventEndInMinutes - currentTimeInMinutes
        
        if (minutesUntilEnd > 2) {
          // Plus de 2 minutes avant la fin → MAINTENANT sur l'événement en cours
          return { badge: "MAINTENANT", eventId: event.id, progress: progressPercent }
        } else {
          // 2 minutes ou moins avant la fin → BIENTÔT sur l'événement suivant
          if (i + 1 < events.length) {
            // Pour BIENTÔT, on le positionne en haut (0%)
            return { badge: "BIENTÔT", eventId: events[i + 1].id, progress: 0 }
          }
        }
        break
      }
    }
    
    // Pas d'événement en cours, chercher le prochain
    if (!currentEvent) {
      for (const event of events) {
        const [hour, min] = event.time.split("h").map(n => Number.parseInt(n) || 0)
        const eventStartInMinutes = hour * 60 + min
        
        if (eventStartInMinutes > currentTimeInMinutes) {
          // C'est un événement futur
          const minutesUntilStart = eventStartInMinutes - currentTimeInMinutes
          
          if (minutesUntilStart <= 2) {
            // 2 minutes ou moins avant le début → BIENTÔT en haut
            return { badge: "BIENTÔT", eventId: event.id, progress: 0 }
          }
          break // Arrêter à la première occurrence future
        }
      }
    }
    
    return null // Aucun badge à afficher
  }
  
  const eventIndicator = getEventIndicator()
  
  // Cette fonction n'est plus nécessaire avec les badges intégrés
  // Les badges seront affichés directement dans les cartes d'événements

  return (
    <section id="timeline" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Notifications - désactivées */}
        {/* {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`shadow-lg border-l-4 ${
                  notification.type === "delay"
                    ? "border-l-red-500 bg-red-50"
                    : notification.type === "adjustment"
                      ? "border-l-blue-500 bg-blue-50"
                      : notification.type === "sync"
                        ? "border-l-green-500 bg-green-50"
                        : "border-l-orange-500 bg-orange-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )} */}

        {/* Modal de mot de passe */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <Lock className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                <h3 className="text-2xl font-serif text-gray-800 mb-4">Contrôle d'Accès</h3>
                <p className="text-gray-600 mb-6">Saisissez votre mot de passe pour accéder au programme privé.</p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 border-rose-300 focus:border-rose-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white">
                      Se Connecter
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Accès Authentifié</span>
                    </div>
                    <p className="text-xs text-green-700">
                      Permet de modifier les statuts des événements des deux programmes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mb-16">
          <Clock className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Programme de la Journée</h2>
          <p className="text-xl text-gray-600">Suivez le déroulement en temps réel</p>

          {/* Message d'erreur de persistance */}
          {persistenceError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              {persistenceError}
            </div>
          )}

          {/* Indicateur de chargement */}
          {isPersistenceLoading && (
            <div className="mt-4 text-sm text-gray-500">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full mr-2"></div>
              Chargement de l'état des événements...
            </div>
          )}

          <div className="mt-6 flex justify-center items-center gap-4 text-sm flex-wrap">
            <div className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="font-semibold text-blue-800">
                {currentTime ? `${currentTime.getHours().toString().padStart(2, '0')}h${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}` : '--h--:--'}
              </span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-full">
              <span>
                🌡️ Boissy-Saint-Léger: {weatherLoading ? "..." : `${temperature}°C ${weatherEmoji}`}
              </span>
            </div>
            <Button
              onClick={toggleSound}
              size="sm"
              variant="outline"
              className={`px-4 py-2 ${soundEnabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              {soundEnabled ? "Son Activé" : "Son Désactivé"}
            </Button>
            {/* Indicateur de statut de connexion seulement (pas de bouton) */}
            <div
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm font-medium">{isOnline ? "En ligne" : "Hors ligne"}</span>
            </div>
          </div>


          {lastUpdated && (
            <div className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-2">
              <span>
                Dernière sauvegarde : {lastUpdated > 0 ? `${new Date(lastUpdated).getHours().toString().padStart(2, '0')}h${new Date(lastUpdated).getMinutes().toString().padStart(2, '0')}` : 'Jamais'}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={reloadState}
                className="h-6 px-2 text-xs"
                disabled={isPersistenceLoading}
              >
                <Wifi className="w-3 h-3 mr-1" />
                Recharger
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-6 md:mb-10 px-2">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-1 md:p-1.5 rounded-2xl shadow-lg inline-flex w-full max-w-lg">
            <div className="flex flex-row gap-0.5 md:gap-1 bg-white rounded-xl p-0.5 md:p-1 w-full">
              <Button
                onClick={() => {
                  setActiveTab("guests")
                }}
                variant="ghost"
                data-guest-program
                className={`relative flex-1 px-2 sm:px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "guests"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105" 
                    : "bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <Users className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-300 ${activeTab === "guests" ? "scale-110" : ""}`} />
                <span className="text-xs sm:text-sm md:text-base">Programme</span>
                {activeTab === "guests" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  handlePrivateTabClick()
                }}
                variant="ghost"
                data-private-program
                className={`relative flex-1 px-2 sm:px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "private"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105" 
                    : "bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <Lock className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-300 ${activeTab === "private" ? "scale-110" : ""}`} />
                <span className="text-xs sm:text-sm md:text-base">Privé</span>
                {activeTab === "private" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </Button>
              
              {/* Bouton Jeu - MASQUÉ */}
              {/* <Button
                onClick={() => setShowGame(!showGame)}
                variant="ghost"
                data-game-button
                className={`relative flex-1 px-2 sm:px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 ${
                  showGame
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105" 
                    : "bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <GamepadIcon className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-300 ${showGame ? "scale-110 rotate-12" : ""}`} />
                <span className="text-xs sm:text-sm md:text-base">Jeu</span>
                {showGame && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </Button> */}
            </div>
          </div>
        </div>

        {/* Affichage conditionnel du jeu ou de la timeline */}
        <div className="relative">
          {/* Animation de transition - Section Jeu */}
          <div className={`transition-all duration-500 transform ${showGame ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"}`}>
            <div className="mt-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-indigo-50 max-w-4xl mx-auto">
                <CardContent className="p-3 scale-90 origin-top">
                  <WeddingGame />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Timeline affichée si le jeu n'est pas actif */}
          <div className={`transition-all duration-500 transform ${!showGame ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"}`}>
            <>
            <div className="relative">
              {/* Timeline principale avec effet de dégradé */}
              <div className="absolute left-5 sm:left-8 md:left-16 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-rose-300 via-pink-400 to-purple-400 opacity-50"></div>

          {/* Ligne de progression jusqu'à la position actuelle */}
          {currentTimePosition !== null && (
            <div 
              className="absolute left-5 sm:left-8 md:left-16 top-0 w-0.5 md:w-1 bg-gradient-to-b from-green-400 to-green-600 z-10"
              style={{ height: `${currentTimePosition}%` }}
            >
              {/* Animation de particules qui montent */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          <div className="space-y-4 md:space-y-8">
            {getCurrentEvents().map((item, index) => {
              const eventKey = item.id
              const displayTime = getDisplayTime(item)
              const status = getEventStatus(eventKey, item.time)
              const canModify = hasPermissionToModify(eventKey)

              return (
                <div key={index} className="relative flex items-start" id={`event-${item.id}`}>
                  {/* Conteneur pour le badge avec position relative */}
                  <div className="absolute left-14 sm:left-20 md:left-28 top-0 bottom-0 w-24 sm:w-32 z-30 pointer-events-none">
                    {/* Badge MAINTENANT ou BIENTÔT qui suit la progression temporelle */}
                    {eventIndicator && eventIndicator.eventId === item.id && (
                      <div 
                        className="absolute w-full transition-all duration-1000 ease-in-out flex items-center"
                        style={{
                          // Calculer la position verticale basée sur la progression
                          // Pour MAINTENANT : suit la progression (0% = haut, 100% = bas)
                          // Pour BIENTÔT : reste en haut (0%)
                          top: `${eventIndicator.progress}%`,
                          // Ajustement pour centrer le badge verticalement
                          transform: 'translateY(-50%)'
                        }}
                      >
                      {/* Ligne de connexion à la timeline */}
                      <div className={`absolute -left-12 md:-left-12 w-12 h-0.5 ${
                        eventIndicator.badge === "MAINTENANT" 
                          ? "bg-gradient-to-r from-transparent to-green-500" 
                          : "bg-gradient-to-r from-transparent to-orange-500"
                      }`}></div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-white text-xs font-semibold ${
                        eventIndicator.badge === "MAINTENANT" 
                          ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                          : "bg-gradient-to-r from-orange-500 to-amber-600"
                      }`}>
                        <div className="flex space-x-0.5">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-200"></span>
                        </div>
                        <span className="tracking-wide">{eventIndicator.badge}</span>
                        {eventIndicator.badge === "MAINTENANT" ? (
                          <>
                            <Clock className="w-3 h-3 animate-pulse" />
                            <span className="text-[10px] ml-1 opacity-90">
                              {Math.round(eventIndicator.progress)}%
                            </span>
                          </>
                        ) : (
                          <Bell className="w-3 h-3 animate-pulse" />
                        )}
                      </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={`absolute left-4 sm:left-6 md:left-14 w-5 h-5 sm:w-6 sm:h-6 ${getEventColor(item.type)} rounded-full border-2 sm:border-4 border-white shadow-lg flex items-center justify-center z-10 ${
                      status === "delayed" ? "animate-pulse" : ""
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs">{getEventIcon(item.type)}</span>
                  </div>

                  <div className="ml-12 sm:ml-16 md:ml-24 flex-1">
                    <Card
                      className={`shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 ${
                        status === "completed"
                          ? "border-l-green-400 bg-green-50"
                          : status === "current"
                            ? "border-l-blue-400 bg-blue-50"
                            : status === "delayed"
                              ? "border-l-red-400 bg-red-50"
                              : status === "soon"
                                ? "border-l-orange-400 bg-orange-50"
                                : "border-l-rose-400"
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        {/* Section du haut: Heure + Durée + Statut */}
                        <div className="bg-gray-50 rounded-lg p-2 mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`${getEventColor(item.type)} text-white px-3 py-1.5 rounded-full font-bold text-sm sm:text-base`}
                            >
                              {displayTime}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                              {item.duration}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                              {getStatusIcon(status)}
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                                  status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : status === "current"
                                      ? "bg-blue-100 text-blue-800"
                                      : status === "delayed"
                                        ? "bg-red-100 text-red-800"
                                        : status === "soon"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {status === "completed"
                                  ? "TERMINÉ"
                                  : status === "current"
                                    ? "EN COURS"
                                    : status === "delayed"
                                      ? "RETARDÉ"
                                      : status === "soon"
                                        ? "BIENTÔT"
                                        : "À VENIR"}
                              </span>
                              {/* Label de visibilité - uniquement dans le programme privé */}
                              {activeTab === "private" && (
                                <span
                                  className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm border flex-shrink-0 ${
                                    (eventVisibility[item.id] ?? item.isPublic)
                                      ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-300"
                                      : "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-purple-300"
                                  }`}
                                  title={`Cet événement est ${(eventVisibility[item.id] ?? item.isPublic) ? "visible par les invités" : "uniquement visible par les organisateurs"}`}
                                >
                                  {(eventVisibility[item.id] ?? item.isPublic) ? "🌐 PUBLIC" : "🔒 PRIVÉ"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Section du centre: Titre avec icône + détails */}
                        <div className="mb-3">
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2">
                            {activeTab === "guests" && guestEventMapping[item.id] ? (
                              <>
                                <span className="text-lg sm:text-xl md:text-2xl mr-1 sm:mr-2">{guestEventMapping[item.id].emoji}</span>
                                <span className="font-bold">{guestEventMapping[item.id].title}</span>
                              </>
                            ) : (
                              item.event
                            )}
                          </h3>


                          {/* Détails affichés selon le programme */}
                          {item.details && (
                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border-l-2 sm:border-l-4 border-gray-300">
                              <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                                {activeTab === "guests" && guestEventMapping[item.id] ? (
                                  guestEventMapping[item.id].description
                                ) : (
                                  <>
                                    <span className="font-semibold text-gray-800">Détails : </span>
                                    {item.details}
                                  </>
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Section du bas: Météo + Boutons de contrôle */}
                        {(item.weather || canModify) && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mt-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              {/* Météo à gauche */}
                              {item.weather && (
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                    <span className="text-lg">{item.weather.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{item.weather.temperature}°C</span>
                                  </div>
                                  {/* Masqué: Label "Extérieur" */}
                                  {/* {item.isOutdoor && (
                                    <div className="flex items-center gap-1 text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded-full">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>Extérieur</span>
                                    </div>
                                  )} */}
                                </div>
                              )}
                              
                              {/* Boutons de contrôle à droite */}
                              {canModify && (
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                  {/* Bouton de visibilité */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const currentVisibility = eventVisibility[item.id] ?? item.isPublic
                                      updateEventVisibility(item.id, !currentVisibility)
                                      playSound("notification")
                                    }}
                                    className={`text-xs px-3 py-1.5 font-medium transition-colors ${
                                      (eventVisibility[item.id] ?? item.isPublic)
                                        ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                        : "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
                                    }`}
                                  >
                                    {(eventVisibility[item.id] ?? item.isPublic) ? "🌐 Public" : "🔒 Privé"}
                                  </Button>
                                  
                                  {/* Boutons d'action */}
                                  <div className="flex gap-1">
                                    {canModifyEvent(item.time) ? (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleUpdateEventStatus(eventKey, "current")}
                                          className={`text-xs px-2 py-1 transition-colors ${
                                            status === "current" 
                                              ? "bg-blue-100 text-blue-700 border-blue-300" 
                                              : "hover:bg-gray-50"
                                          }`}
                                        >
                                          En cours
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleUpdateEventStatus(eventKey, "completed")}
                                          className={`text-xs px-2 py-1 transition-colors ${
                                            status === "completed" 
                                              ? "bg-green-100 text-green-700 border-green-300" 
                                              : "hover:bg-gray-50"
                                          }`}
                                        >
                                          Terminé
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleUpdateEventStatus(eventKey, "delayed")}
                                          className={`text-xs px-2 py-1 transition-colors ${
                                            status === "delayed" 
                                              ? "bg-red-100 text-red-700 border-red-300" 
                                              : "hover:bg-gray-50"
                                          }`}
                                        >
                                          Retard
                                        </Button>
                                      </>
                                    ) : (
                                      <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Terminé automatiquement
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Label de statut actuel */}
                                  <div
                                    className={`text-center text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
                                      status === "completed"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : status === "current"
                                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                                          : status === "delayed"
                                            ? "bg-red-100 text-red-800 border border-red-200"
                                            : status === "soon"
                                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                                              : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }`}
                                  >
                                    STATUT: {status === "completed"
                                      ? "TERMINÉ"
                                      : status === "current"
                                        ? "EN COURS"
                                        : status === "delayed"
                                          ? "RETARDÉ"
                                          : status === "soon"
                                            ? "BIENTÔT"
                                            : "À VENIR"}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="inline-block border-none shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 max-w-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                {activeTab === "guests" ? (
                  <Users className="w-6 h-6 text-rose-500" />
                ) : (
                  <Lock className="w-6 h-6 text-rose-500" />
                )}
                <h3 className="text-2xl font-serif text-gray-800">
                  {activeTab === "guests" ? "Pour nos Invités" : "Organisation Privée"}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {activeTab === "guests"
                  ? "Suivez l'avancement des événements en temps réel."
                  : "Programme détaillé pour l'équipe d'organisation - accessible à tous."}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>À venir</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bell className="w-3 h-3 text-orange-500" />
                  <span>Bientôt</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-3 h-3 text-blue-500" />
                  <span>En cours</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Terminé</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span>Retardé</span>
                </div>
              </div>

              {/* Indicateur de synchronisation automatique */}
              <div className={`mt-4 p-3 rounded-lg ${isOnline ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isOnline ? (
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-green-600" />
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-semibold ${isOnline ? "text-green-700" : "text-red-700"}`}>
                    {isOnline ? "Synchronisation automatique active" : "Connexion interrompue"}
                  </span>
                </div>
                <p className={`text-sm ${isOnline ? "text-green-700" : "text-red-700"}`}>
                  {isOnline
                    ? "Les changements sont synchronisés automatiquement toutes les 3 secondes"
                    : "Reconnexion automatique en cours..."}
                </p>
              </div>

              {soundEnabled && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    🔊 <strong>Sons activés :</strong> Notifications sonores lors des changements de statut et
                    synchronisations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
          </>
            </div>
        </div>
      </div>
    </section>
  )
}
