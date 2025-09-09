// Définition des événements pour le mariage d'Emmanuel & Diane - Dimanche 14 Septembre 2025
export const allEventsData: {
  id: string
  time: string
  event: string
  location: string
  duration: string
  type: string
  isPublic: boolean
  isOutdoor?: boolean
  details?: string
}[] = [
  // ================================================
  // MARIAGE RELIGIEUX D'EMMANUEL & DIANE - DIMANCHE 14 SEPTEMBRE 2025
  // ================================================
  
  // ========== PHASE PRÉPARATIFS (PRIVÉ) ==========
  
  // 10h00 - Réveil
  {
    id: "prep-1",
    time: "10h00",
    event: "Réveil des mariés ☀️",
    location: "Domicile de la mariée",
    duration: "30min",
    type: "preparation",
    isPublic: false,
    details: "Réveil en douceur. Responsable: Laura (Coiffeuse) - 07 67 91 54 84"
  },
  
  // 10h30 - Petit déjeuner
  {
    id: "prep-2",
    time: "10h30",
    event: "Petit déjeuner énergisant ☕",
    location: "Domicile de la mariée",
    duration: "30min",
    type: "preparation",
    isPublic: false,
    details: "Service par Angélique 'Tante Diane' (07 58 29 09 13) et Chantal 'Marraine' (06 11 35 30 79)"
  },
  
  // 12h00 - Début préparatifs intensifs
  {
    id: "prep-3",
    time: "12h00",
    event: "Préparatifs : Maquillage, Coiffure & Habillage 💄",
    location: "Domicile de la mariée",
    duration: "2h",
    type: "preparation",
    isPublic: false,
    details: "Équipe complète: Laura (coiffure), Angélique (maquillage), Chantal (habillage). Arrivée photographe Omadz (06 51 24 10 91)"
  },
  
  // 13h00 - Fin préparatifs
  {
    id: "prep-4",
    time: "13h00",
    event: "Finalisation des préparatifs ✨",
    location: "Domicile de la mariée",
    duration: "50min",
    type: "preparation",
    isPublic: false,
    details: "Dernières retouches et vérifications. Responsable: Chantal (06 11 35 30 79)"
  },
  
  // 13h20 - Départ
  {
    id: "transport-1",
    time: "13h20",
    event: "Départ vers la salle 🚗",
    location: "Domicile → Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "25min",
    type: "preparation",
    isPublic: false,
    details: "Transport assuré par Jules (témoin du marié) - 07 83 59 31 07"
  },
  
  // ========== PHASE CÉRÉMONIE (PUBLIC) ==========
  
  // 13h45 - Arrivée (PRIVÉ)
  {
    id: "arrival-1",
    time: "13h45",
    event: "Arrivée des mariés sur place",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "15min",
    type: "arrival",
    isPublic: false,
    details: "Installation et dernières vérifications"
  },
  
  // 14h00 - Accueil invités (PUBLIC)
  {
    id: "ceremony-1",
    time: "14h00",
    event: "🌸 Accueil chaleureux des invités",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "1h",
    type: "arrival",
    isPublic: true,
    details: "Installation selon le plan de table. Coordination: Nadine (06 28 55 35 59)"
  },
  
  // 15h00 - Entrée des mariés
  {
    id: "ceremony-2",
    time: "15h00",
    event: "💑 Entrée solennelle d'Emmanuel & Diane",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "ceremony",
    isPublic: true,
    details: "Entrée majestueuse accompagnés de leurs parents"
  },
  
  // 15h10 - Début cérémonie religieuse
  {
    id: "ceremony-3",
    time: "15h10",
    event: "⛪ Cérémonie religieuse - Prière d'ouverture",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "ceremony",
    isPublic: true,
    details: "Prière de bénédiction par le Pasteur Ngarukiye"
  },
  
  // 15h20 - Échange des vœux
  {
    id: "ceremony-4",
    time: "15h20",
    event: "💍 Échange des vœux et des alliances",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "20min",
    type: "ceremony",
    isPublic: true,
    details: "Moment émouvant avec enseignement du Pasteur Corneil. Alliance présentée par les témoins"
  },
  
  // 15h40 - Pause (PRIVÉ)
  {
    id: "break-1",
    time: "15h40",
    event: "Pause technique",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "5min",
    type: "preparation",
    isPublic: false,
    details: "Réorganisation de l'espace"
  },
  
  // 15h45 - Vin d'honneur
  {
    id: "reception-1",
    time: "15h45",
    event: "🥂 Vin d'honneur festif",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger - Espace cocktail",
    duration: "45min",
    type: "reception",
    isPublic: true,
    isOutdoor: true,
    details: "Cocktail raffiné avec animations. Service coordonné par le MC"
  },
  
  // 16h30 - Séance photos
  {
    id: "photo-1",
    time: "16h30",
    event: "📸 Séance photos souvenirs",
    location: "Parc adjacent à la salle",
    duration: "1h",
    type: "photo",
    isPublic: true,
    isOutdoor: true,
    details: "Photos couple au parc, photos familles par alternance. Coordination: MC et Colonell"
  },
  
  // 16h45 - Retour mariés (PRIVÉ)
  {
    id: "transition-1",
    time: "16h45",
    event: "Retour des mariés à la salle",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "5min",
    type: "preparation",
    isPublic: false,
    details: "Transition vers séance photo générale. Annonce par MC"
  },
  
  // 16h50 - Photos générales
  {
    id: "photo-2",
    time: "16h50",
    event: "📸 Séance photo avec tous les invités",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "1h",
    type: "photo",
    isPublic: true,
    details: "Photos par tables. Ordre: cortège d'abord, puis tables, mariée en dernier"
  },
  
  // 18h20 - Fin photos (PRIVÉ)
  {
    id: "transition-2",
    time: "18h20",
    event: "Fin de la séance photo",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "preparation",
    isPublic: false,
    details: "Libération du cortège pour changement de tenue"
  },
  
  // 18h30 - Retour invités
  {
    id: "transition-3",
    time: "18h30",
    event: "Installation des invités en salle",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "30min",
    type: "preparation",
    isPublic: false,
    details: "Coordination: MC + Colonell avec Nadine en support"
  },
  
  // ========== PHASE SOIRÉE (PUBLIC) ==========
  
  // 19h00 - Entrée nouvelle tenue
  {
    id: "evening-1",
    time: "19h00",
    event: "✨ Grande entrée des mariés - Nouvelle tenue",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "reception",
    isPublic: true,
    details: "Entrée spectaculaire d'Emmanuel & Diane en nouvelle tenue avec le cortège"
  },
  
  // 19h10 - Discours familles (SEMI-PUBLIC)
  {
    id: "evening-2",
    time: "19h10",
    event: "💬 Discours des familles",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "20min",
    type: "ceremony",
    isPublic: true,
    details: "Nadine et Divine. Un membre par famille"
  },
  
  // 19h50 - Pause (PRIVÉ)
  {
    id: "break-2",
    time: "19h50",
    event: "Pause et préparation repas",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "preparation",
    isPublic: false,
    details: "Mise en place finale pour le service"
  },
  
  // 20h00 - Dîner
  {
    id: "dinner-1",
    time: "20h00",
    event: "🍽️ Dîner de gala",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "2h",
    type: "reception",
    isPublic: true,
    details: "Buffet gastronomique. Service par Nelly (06 35 92 38 10). Appel par numéro de table"
  },
  
  // 22h00 - Fin repas (PRIVÉ)
  {
    id: "transition-4",
    time: "22h00",
    event: "Fin du service repas",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "preparation",
    isPublic: false,
    details: "Débarrassage et préparation suite"
  },
  
  // 22h10 - Cadeaux
  {
    id: "gifts-1",
    time: "22h10",
    event: "🎁 Partage des cadeaux",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "30min",
    type: "ceremony",
    isPublic: true,
    details: "Remise des cadeaux aux mariés. Photos avec chaque table"
  },
  
  // 22h40 - Pause (PRIVÉ)
  {
    id: "break-3",
    time: "22h40",
    event: "Préparation pièce montée",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "preparation",
    isPublic: false,
    details: "Installation du gâteau par l'équipe de Pamk"
  },
  
  // 22h50 - Discours mariés
  {
    id: "speech-1",
    time: "22h50",
    event: "💬 Discours d'Emmanuel & Diane",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "10min",
    type: "ceremony",
    isPublic: true,
    details: "Remerciements émouvants et annonce du gâteau"
  },
  
  // 23h00 - Pièce montée
  {
    id: "cake-1",
    time: "23h00",
    event: "🎂 La pièce montée",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "1h20",
    type: "reception",
    isPublic: true,
    details: "Découpe traditionnelle et service du dessert. Équipe Pamk (07 83 15 96 26)"
  },
  
  // 00h00 - Ouverture bal
  {
    id: "party-1",
    time: "00h00",
    event: "💃 Ouverture du bal",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "1h",
    type: "entertainment",
    isPublic: true,
    details: "Première danse des mariés suivie de la soirée dansante"
  },
  
  // 01h00 - Fin
  {
    id: "end-1",
    time: "01h00",
    event: "🌙 Fin des festivités",
    location: "Salle des fêtes, 6 rue de Sucy 94470 Boissy-Saint-Léger",
    duration: "15min",
    type: "ceremony",
    isPublic: true,
    details: "Remerciements finaux et clôture de la célébration. Annonce par MC"
  }
]