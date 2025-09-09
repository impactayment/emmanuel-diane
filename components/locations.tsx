import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

export default function Locations() {
  const locations = [
    {
      name: "Cérémonie Religieuse",
      address: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
      time: "15h00 - 16h30",
      description: "Union sacrée devant Dieu - Échange des vœux et bénédictions",
      color: "blue"
    },
    {
      name: "Réception Festive", 
      address: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
      time: "19h30 - 01h00",
      description: "Dîner de gala, animations et soirée dansante avec famille et amis",
      color: "rose"
    },
  ]


  return (
    <section id="locations" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <MapPin className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Lieux de Célébration</h2>
          <p className="text-xl text-gray-600">Deux moments distincts dans le même lieu privilégié</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location, index) => {
            const colorClass = location.color === 'blue' ? 'blue' : 'rose'
            return (
              <Card key={index} className={`border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-${colorClass}-50 to-${colorClass === 'blue' ? 'indigo' : 'pink'}-50`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 text-xl font-serif text-${colorClass === 'blue' ? 'blue-800' : 'rose-800'}`}>
                    <Navigation className={`w-6 h-6 text-${colorClass === 'blue' ? 'blue-600' : 'rose-500'}`} />
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className={`font-semibold text-${colorClass === 'blue' ? 'blue-800' : 'gray-800'}`}>{location.address}</p>
                      <p className={`text-${colorClass === 'blue' ? 'blue' : 'rose'}-600 font-medium`}>{location.time}</p>
                    </div>
                    <p className={`text-${colorClass === 'blue' ? 'blue' : 'rose'}-700`}>{location.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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