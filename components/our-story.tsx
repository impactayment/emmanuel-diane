import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

export default function OurStory() {
  return (
    <section id="our-story" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Notre Histoire</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une belle histoire d'amour qui nous mène vers le plus beau jour de notre vie
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif text-gray-800 mb-4">Emmanuel</h3>
              <p className="text-gray-600 leading-relaxed">
                Avec un cœur plein d'amour et d'espoir, je me prépare à dire "oui" à la femme de ma vie. Cette journée
                représente le début de notre aventure commune, entourés de nos familles et amis les plus chers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif text-gray-800 mb-4">Diane</h3>
              <p className="text-gray-600 leading-relaxed">
                Mon cœur déborde de joie à l'idée de m'unir à l'homme de ma vie. Ensemble, nous écrirons une nouvelle
                page de notre histoire, dans l'amour, le respect et la complicité.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
