import { Heart, Mic, Music, PartyPopper, Star, ChevronRight, Sparkles, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Section principale avec design amélioré */}
      <div className="container mx-auto px-4 py-12">
        {/* Section MC mise en avant */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="bg-gradient-to-r from-rose-900/30 via-purple-900/30 to-rose-900/30 rounded-xl p-6 sm:p-8 border border-rose-500/20 backdrop-blur-sm">
            <div className="text-center">
              {/* Animation de micro */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
                  <Mic className="w-14 h-14 text-rose-400 relative z-10" />
                </div>
              </div>
              
              {/* Titre principal */}
              <p className="text-rose-300 text-xs uppercase tracking-wider mb-1">
                Votre Maître de Cérémonie
              </p>
              
              {/* Nom du MC */}
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                ANDERSEN ISAAC
              </h3>
              
              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-xl mx-auto px-4 sm:px-0">
                Maître de cérémonie professionnel qui orchestrera votre soirée avec élégance et bonne humeur
              </p>
              
              {/* Services offerts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-rose-500/50 transition-all">
                  <Mic className="w-7 h-7 text-rose-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold text-sm">Maître de Cérémonie</h4>
                  <p className="text-gray-400 text-xs">Animation professionnelle</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-rose-500/50 transition-all">
                  <Clock className="w-7 h-7 text-rose-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold text-sm">Coordination</h4>
                  <p className="text-gray-400 text-xs">Timing parfait</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-rose-500/50 transition-all">
                  <PartyPopper className="w-7 h-7 text-rose-400 mx-auto mb-2" />
                  <h4 className="text-white font-semibold text-sm">Animations</h4>
                  <p className="text-gray-400 text-xs">Moments inoubliables</p>
                </div>
              </div>

              {/* CTA Button - Instagram */}
              <a 
                href="https://www.instagram.com/Impactayment/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Suivez sur Instagram
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Section couple */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-rose-400 animate-pulse mr-2" />
            <h3 className="text-xl font-serif text-white">Emmanuel & Diane</h3>
            <Heart className="w-6 h-6 text-rose-400 animate-pulse ml-2" />
          </div>
          <p className="text-gray-300 text-sm mb-1">14 septembre 2025 • Boissy-Saint-Léger</p>
          <p className="text-gray-400 text-sm">
            Merci de partager ce moment spécial avec nous
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Emmanuel & Diane Wedding
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Site créé avec ❤️ pour célébrer notre union
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
