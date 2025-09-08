import { type NextRequest, NextResponse } from "next/server"

// Types de notifications
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

// Stockage en mémoire (en production, utilisez une vraie DB)
let notifications: Notification[] = []
let notificationId = 1

// GET - Récupérer toutes les notifications
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const unreadOnly = searchParams.get("unread") === "true"
  const limit = parseInt(searchParams.get("limit") || "50")
  
  let filteredNotifications = notifications
  
  if (unreadOnly) {
    filteredNotifications = notifications.filter(n => !n.isRead)
  }
  
  // Trier par timestamp décroissant (plus récent en premier)
  filteredNotifications.sort((a, b) => b.timestamp - a.timestamp)
  
  // Limiter le nombre de résultats
  filteredNotifications = filteredNotifications.slice(0, limit)
  
  return NextResponse.json({
    notifications: filteredNotifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    totalCount: notifications.length,
  })
}

// POST - Créer une nouvelle notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = "info", title, message, eventId, priority = "medium" } = body
    
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      )
    }
    
    const notification: Notification = {
      id: `notif_${notificationId++}_${Date.now()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      isRead: false,
      eventId,
      priority,
    }
    
    notifications.push(notification)
    
    // Limiter à 100 notifications max en mémoire
    if (notifications.length > 100) {
      notifications = notifications.slice(-100)
    }
    
    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la notification" },
      { status: 500 }
    )
  }
}

// PATCH - Marquer une ou plusieurs notifications comme lues
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, markAllAsRead } = body
    
    if (markAllAsRead) {
      notifications = notifications.map(n => ({ ...n, isRead: true }))
      
      return NextResponse.json({
        success: true,
        markedCount: notifications.length,
      })
    }
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "notificationIds array is required" },
        { status: 400 }
      )
    }
    
    let markedCount = 0
    notifications = notifications.map(n => {
      if (notificationIds.includes(n.id)) {
        markedCount++
        return { ...n, isRead: true }
      }
      return n
    })
    
    return NextResponse.json({
      success: true,
      markedCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des notifications" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une ou plusieurs notifications
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const notificationId = searchParams.get("id")
    const clearAll = searchParams.get("clearAll") === "true"
    
    if (clearAll) {
      const count = notifications.length
      notifications = []
      
      return NextResponse.json({
        success: true,
        deletedCount: count,
      })
    }
    
    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      )
    }
    
    const initialLength = notifications.length
    notifications = notifications.filter(n => n.id !== notificationId)
    const deletedCount = initialLength - notifications.length
    
    return NextResponse.json({
      success: true,
      deletedCount,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la notification" },
      { status: 500 }
    )
  }
}