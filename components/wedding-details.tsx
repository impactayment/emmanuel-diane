import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Church, PartyPopper, Utensils, Music, Heart, Users } from "lucide-react"

export default function WeddingDetails() {
  return (
    <section id="wedding-details" className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Détails de la Cérémonie</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rejoignez-nous pour célébrer notre union dans la joie et l'amour - Cérémonie religieuse et Réception
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

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif text-blue-800">Cérémonie Religieuse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-2 font-semibold">15h00 - 16h30</p>
              <p className="text-sm text-blue-600">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
              <p className="text-xs text-blue-500 mt-2 italic">Union sacrée devant Dieu</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader>
              <Utensils className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif text-rose-800">Réception & Dîner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-rose-700 mb-2 font-semibold">20h00 - 22h00</p>
              <p className="text-sm text-gray-600">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
              <p className="text-xs text-rose-500 mt-2 italic">Célébration avec famille et amis</p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Music className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <CardTitle className="text-xl font-serif">Soirée Dansante</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">00h00 - 01h00</p>
              <p className="text-sm text-gray-500">Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-blue-800 mb-4">Cérémonie Religieuse</h3>
              <p className="text-blue-700 max-w-md mx-auto">
                Moment sacré de notre union devant Dieu, nos familles et nos proches. 
                Échange des vœux, bénédictions et prières dans un cadre solennel et émouvant.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-gradient-to-br from-rose-50 to-pink-50">
            <CardContent className="p-8">
              <Music className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-rose-800 mb-4">Réception Festive</h3>
              <p className="text-rose-700 max-w-md mx-auto">
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