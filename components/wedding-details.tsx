import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, PartyPopper, Utensils, Music, Heart, Users } from "lucide-react"

export default function WeddingDetails() {
  return (
    <section id="wedding-details" className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Détails de la Cérémonie</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoignez-nous pour célébrer notre union dans la joie et l'amour
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif">Accueil des Invités</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">14h00 - 15h00</p>
              <p className="text-sm text-gray-500">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif">Cérémonie religieuse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">15h00 - 16h30</p>
              <p className="text-sm text-gray-500">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Utensils className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif">Dîner de Réception</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">19h30 - 21h30</p>
              <p className="text-sm text-gray-500">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Music className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif">Soirée Dansante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">21h30 - 01h00</p>
              <p className="text-sm text-gray-500">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block border-none shadow-lg bg-white">
            <CardContent className="p-8">
              <Music className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-gray-800 mb-4">Une journée mémorable</h3>
              <p className="text-gray-600 max-w-md">
                Venez danser et célébrer avec nous ! Musique variée pour toutes les générations, 
                animations et surprises musicales. Une soirée inoubliable à la Salle des fêtes !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}