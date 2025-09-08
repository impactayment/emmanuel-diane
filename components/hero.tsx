"use client"

import { Button } from "@/components/ui/button"
import { Heart, Calendar, MapPin, Clock, MapIcon, Users, Gamepad2, Sparkles, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Countdown from "@/components/countdown"

export default function Hero() {
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setActiveButton(sectionId)
    
    // Reset active state after animation
    setTimeout(() => setActiveButton(null), 2000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTooltip(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
      <div className="text-center px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl mx-auto py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-rose-500 mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 animate-bounce" />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] mb-3 sm:mb-4">MARIAGE</p>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gray-800 mb-3 sm:mb-4">
            <span className="font-script text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">Diane</span>
            <span className="block text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-500 my-1 xs:my-2 font-serif">&</span>
            <span className="font-script text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">Emmanuel</span>
          </h1>
          <div className="relative mt-4 sm:mt-5 md:mt-6">
            <p 
              className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-700 font-serif cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className={`transition-opacity duration-500 ${showTooltip ? 'hidden' : 'inline'}`}>
                MURAKAZA NEZA
              </span>
              <span className={`transition-opacity duration-500 ${showTooltip ? 'inline' : 'hidden'}`}>
                SOYEZ LES BIENVENUS
              </span>
              <span className="mx-2">~</span>
              <span className={`transition-opacity duration-500 ${showTooltip ? 'hidden' : 'inline'}`}>
                SOYEZ LES BIENVENUS
              </span>
              <span className={`transition-opacity duration-500 ${showTooltip ? 'inline' : 'hidden'}`}>
                MURAKAZA NEZA
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-center items-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-rose-200">
            <Calendar className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="text-sm text-gray-800 font-medium whitespace-nowrap">14 septembre 2025 • 14h00</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-rose-200">
            <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="text-sm text-gray-800 font-medium">Boissy-Saint-Léger</span>
          </div>
        </div>

        {/* Compte à rebours */}
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <Countdown />
        </div>

        {/* Navigation principale - Mise en avant Programme et Détails */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 max-w-2xl mx-auto">
          {/* Sur mobile: 2 lignes, sur desktop: tous sur une ligne sauf le bouton Jeu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">

            {/* Bouton Programme - Principal */}
            <Button
              onClick={() => scrollToSection("timeline")}
              className={`group relative overflow-hidden text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 px-2 py-2 xs:px-2.5 xs:py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 ${
                activeButton === "timeline"
                  ? "bg-gradient-to-r from-rose-700 to-rose-600 border-rose-700/30 scale-105 shadow-2xl"
                  : "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 border-rose-600/20"
              }`}
            >
              <span className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                <Clock className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${activeButton === "timeline" ? "animate-spin" : "group-hover:animate-spin"}`} />
                <span className="text-xs xs:text-sm sm:text-base md:text-base font-bold">Programme</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Sparkles className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
            </Button>

            {/* Bouton Détails */}
            <Button
              onClick={() => scrollToSection("wedding-details")}
              className={`group relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 px-2 py-2 xs:px-2.5 xs:py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 ${
                activeButton === "wedding-details"
                  ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white border-pink-600/30 scale-105 shadow-2xl"
                  : "bg-gradient-to-r from-pink-500 to-pink-400 text-white hover:from-pink-600 hover:to-pink-500 border-pink-500/20"
              }`}
            >
              <span className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                <Heart className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${activeButton === "wedding-details" ? "animate-pulse" : "group-hover:animate-pulse"}`} />
                <span className="text-xs xs:text-sm sm:text-base md:text-base font-bold">Détails</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>

            {/* Bouton Lieux */}
            <Button
              onClick={() => scrollToSection("locations")}
              className={`group relative overflow-hidden text-gray-700 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 border px-2 py-2 xs:px-2.5 xs:py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                activeButton === "locations"
                  ? "bg-gray-100 border-gray-400 scale-105 shadow-xl"
                  : "bg-white/90 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                <MapIcon className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${activeButton === "locations" ? "text-gray-700 animate-bounce" : "text-gray-600 group-hover:text-gray-700"}`} />
                <span className="text-xs xs:text-sm sm:text-base md:text-base font-bold">Lieux</span>
              </span>
              <div className="absolute inset-0 bg-gray-50/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>

            {/* Bouton Équipe */}
            <Button
              onClick={() => scrollToSection("team")}
              className={`group relative overflow-hidden text-gray-700 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 border px-2 py-2 xs:px-2.5 xs:py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                activeButton === "team"
                  ? "bg-gray-100 border-gray-400 scale-105 shadow-xl"
                  : "bg-white/90 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                <Users className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${activeButton === "team" ? "text-gray-700 animate-bounce" : "text-gray-600 group-hover:text-gray-700"}`} />
                <span className="text-xs xs:text-sm sm:text-base md:text-base font-bold">Équipe</span>
              </span>
              <div className="absolute inset-0 bg-gray-50/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>

          {/* Bouton Jeu des Mariés - Séparé - CACHÉ
          <div className="flex justify-center">
            <Button
              onClick={() => {
                const timelineElement = document.getElementById("timeline")
                if (timelineElement) {
                  timelineElement.scrollIntoView({ behavior: "smooth" })
                  setTimeout(() => {
                    const gameButton = document.querySelector('[data-game-button]')
                    if (gameButton instanceof HTMLElement) {
                      gameButton.click()
                    }
                  }, 1000)
                }
              }}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 border border-purple-600/20 px-4 py-3 sm:px-5 sm:py-3 md:px-6 md:py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 w-full sm:w-1/2 md:w-1/2 lg:w-1/2"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                <span className="text-sm xs:text-base sm:text-lg font-bold">Jeu des Mariés</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>
          */}
        </div>

        {/* Call to Action secondaire avec indication de scroll */}
        <div className="flex flex-col items-center gap-2 mt-4 pb-8">
          <p className="text-gray-600 text-sm md:text-base animate-fade-in">
            Explorez notre site pour découvrir tous les détails de notre grand jour
          </p>
          <div className="animate-bounce mt-2">
            <ChevronDown className="w-6 h-6 text-rose-400" />
          </div>
        </div>
      </div>
    </section>
  )
}
