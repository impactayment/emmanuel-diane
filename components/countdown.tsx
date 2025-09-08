"use client"

import { useState, useEffect } from "react"
import React from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const calculateTimeLeft = () => {
      // Date du mariage : 14 septembre 2025 à 14h00 (heure locale)
      // IMPORTANT: Utiliser l'heure locale pour éviter les problèmes de timezone
      const weddingDate = new Date(2025, 8, 14, 14, 0, 0) // Mois 8 = Septembre (0-indexed)
      const now = new Date()
      
      // Calculer la différence en millisecondes
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        // Calculer jours, heures, minutes, secondes restants
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        // Le mariage est passé ou c'est le jour J
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Calculer immédiatement
    calculateTimeLeft()

    // Mettre à jour chaque seconde
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const timeBlocks = [
    { value: timeLeft.days, label: "J", fullLabel: "Jours", color: "from-rose-400 to-rose-500" },
    { value: timeLeft.hours, label: "H", fullLabel: "Heures", color: "from-purple-400 to-purple-500" },
    { value: timeLeft.minutes, label: "M", fullLabel: "Minutes", color: "from-pink-400 to-pink-500" },
    { value: timeLeft.seconds, label: "S", fullLabel: "Secondes", color: "from-blue-400 to-blue-500" }
  ]

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Titre simple sans doublon */}
      <div className="text-center mb-2 sm:mb-3">
        <p className="text-sm sm:text-base text-gray-700 font-medium uppercase tracking-wider">Il reste</p>
      </div>

      {/* Design épuré avec format horloge numérique - Plus compact sur mobile */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-2 sm:p-3 border border-gray-200">
        <div className="flex justify-center items-center gap-0.5 sm:gap-1">
          {timeBlocks.map((block, index) => (
            <React.Fragment key={block.label}>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 tabular-nums">
                  {String(block.value).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider mt-0">
                  {block.fullLabel}
                </div>
              </div>
              {index < timeBlocks.length - 1 && (
                <span className="text-lg sm:text-xl md:text-2xl text-gray-400 mx-0.5 sm:mx-1 self-start mt-0.5 sm:mt-1">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Message spécial si c'est le jour J */}
      {timeLeft.days === 0 && timeLeft.hours < 24 && (
        <div className="mt-2 text-center">
          <span className="text-xs font-semibold text-rose-600 animate-pulse">
            C'est aujourd'hui !
          </span>
        </div>
      )}
    </div>
  )
}