import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

export default function Locations() {
  // Suppression de l'array locations car maintenant codé en dur pour éviter les classes dynamiques


  return (
    <section id="locations" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <MapPin className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Lieux de Célébration</h2>
          <p className="text-xl text-gray-600">Deux moments distincts dans le même lieu privilégié</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cérémonie Religieuse */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-serif text-blue-800">
                <Navigation className="w-6 h-6 text-blue-600" />
                Cérémonie Religieuse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-blue-800">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
                  <p className="text-blue-600 font-medium">15h00 - 16h30</p>
                </div>
                <p className="text-blue-700">Union sacrée devant Dieu - Échange des vœux et bénédictions</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Réception Festive */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl font-serif text-rose-800">
                <Navigation className="w-6 h-6 text-rose-500" />
                Réception Festive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-800">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
                  <p className="text-rose-600 font-medium">19h30 - 01h00</p>
                </div>
                <p className="text-rose-700">Dîner de gala, animations et soirée dansante avec famille et amis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block border-none shadow-lg bg-white max-w-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-serif text-gray-800 mb-3">Informations Pratiques</h3>
              <p className="text-gray-600 mb-4">
                Parking gratuit disponible sur place
              </p>
              <p className="text-gray-600">
                N'hésitez pas à nous contacter pour plus d'informations sur les trajets
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}