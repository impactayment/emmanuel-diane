"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mic, Music, Camera, Heart, Crown, Link } from "lucide-react"

export default function Team() {
  const teamMembers = [
    {
      name: "Andersen Isaac",
      role: "Maître de Cérémonie",
      description: "Animateur principal de la réception, il guidera la soirée avec élégance et bonne humeur",
      icon: Mic,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      link: "https://linktr.ee/andersen_isaac"
    },
    {
      name: "DJ LIXX",
      role: "DJ Officiel",
      description: "Ambiance musicale garantie tout au long de la soirée avec des morceaux choisis",
      icon: Music,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      link: "https://djlixx.com"
    },
    {
      name: "Abiwacu",
      role: "Groupe de Danse",
      description: "Troupe de danseurs qui nous feront découvrir les danses traditionnelles rwandaises",
      icon: Crown,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      name: "Mélodie et Albert",
      role: "Coordinateurs",
      description: "Ils veilleront à l'organisation parfaite de l'installation des invités dans la salle",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <Users className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Notre Équipe</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Les personnes exceptionnelles qui nous accompagnent pour faire de cette journée un moment inoubliable
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            const IconComponent = member.icon
            return (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${member.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent className={`w-8 h-8 ${member.color}`} />
                  </div>
                  <CardTitle className="text-xl font-serif text-gray-800">{member.name}</CardTitle>
                  <p className={`text-sm font-semibold ${member.color}`}>{member.role}</p>
                  {member.coordinators && (
                    <p className="text-xs text-gray-500 mt-1">Coordinateurs: {member.coordinators}</p>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  {member.link && (
                    <div className="mt-4 flex justify-center">
                      <a
                        href={member.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-500 transition-colors"
                        title="Voir plus"
                      >
                        <Link className="w-5 h-5" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="inline-block border-none shadow-lg bg-white max-w-2xl">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-gray-800 mb-4">Un Grand Merci</h3>
              <p className="text-gray-600 leading-relaxed">
                Nous tenons à remercier chaleureusement toute notre équipe qui travaille dans l'ombre pour faire de
                notre mariage une célébration parfaite. Leur dévouement et leur professionnalisme nous permettront de
                vivre pleinement chaque instant de cette journée exceptionnelle.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg bg-gradient-to-br from-rose-50 to-pink-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-serif text-gray-800 mb-3 flex items-center gap-2">
                <Crown className="w-6 h-6 text-rose-500" />
                Traditions Rwandaises
              </h3>
              <p className="text-gray-600">
                Le groupe Abiwacu nous fera l'honneur de présenter les danses traditionnelles rwandaises et
                invitera nos invités à participer à ces moments de partage culturel.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-serif text-gray-800 mb-3 flex items-center gap-2">
                <Music className="w-6 h-6 text-blue-500" />
                Ambiance Musicale
              </h3>
              <p className="text-gray-600">
                DJ LIXX veillera à créer l'ambiance parfaite pour chaque moment de la soirée, du dîner aux danses, en
                passant par les moments plus intimes.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  )
}
