"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Home, MapPin, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(30)
  
  useEffect(() => {
    // Compte à rebours pour la redirection automatique
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Cœurs flottants en arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <Heart 
              className="text-rose-200 opacity-30" 
              size={20 + Math.random() * 30}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Animation du 404 */}
        <div className="mb-8 relative">
          <h1 className="text-8xl md:text-9xl font-serif text-rose-300 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-20 h-20 text-rose-500 animate-ping" />
          </div>
        </div>

        {/* Message romantique */}
        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">
            Oups ! L'amour vous a égaré...
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Cette page s'est envolée avec les colombes ! 
            Mais ne vous inquiétez pas, nous allons vous ramener à la célébration.
          </p>
          
          {/* Informations du mariage */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 text-gray-700">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>Emmanuel & Diane</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              <span>14 septembre 2025</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Tourcoing</span>
            </div>
          </div>
        </div>

        {/* Compte à rebours de redirection */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold animate-pulse">
              {countdown}
            </div>
            <span className="text-gray-700">
              Retour automatique dans {countdown} seconde{countdown > 1 ? 's' : ''}...
            </span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Home className="w-5 h-5 mr-2" />
              Retourner à l'accueil
            </Button>
          </Link>
          
          <Link href="/#timeline">
            <Button variant="outline" className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Calendar className="w-5 h-5 mr-2" />
              Voir le programme
            </Button>
          </Link>
        </div>

        {/* Message poétique en bas */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-sm text-gray-500 italic">
            "L'amour ne se perd jamais, il trouve toujours son chemin..."
          </p>
        </div>
      </div>

      {/* Styles pour l'animation de flottement */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.5;
          }
          66% {
            transform: translateY(20px) rotate(-10deg);
            opacity: 0.2;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}