// Définition de tous les événements (publics et privés) sans la météo
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
  // CÉRÉMONIE DU DOT - 14 SEPTEMBRE 2025
  // ================================================
  
  // 14h00 - Accueil des invités
  {
    id: "dot-1",
    time: "14h00",
    event: "Accueil chaleureux des invités 🌸",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "45min",
    type: "arrival",
    isPublic: true,
    isOutdoor: true,
    details: "Accueil à l'extérieur (plan B si pluie : petite salle). Service d'accueil, verre d'accueil + cocktail avec ambiance musicale",
  },
  
  // 14h45 - Installation (PRIVÉ - logistique)
  {
    id: "dot-2",
    time: "14h45",
    event: "Installation des invités et de la famille de Diane",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "15min",
    type: "preparation",
    isPublic: false,
    details: "Andersen (MC) souhaite la bienvenue à tous. Installation coordonnée de la famille de Diane",
  },
  
  // 15h00 - Entrée famille d'Emmanuel (PUBLIC)
  {
    id: "dot-3",
    time: "15h00",
    event: "Entrée solennelle de la famille du marié",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "30min",
    type: "ceremony",
    isPublic: true,
    details: "Musique: Marebe - Cyusa / Nk'umwamikazi - Kagambe. Ils apportent ibisabisho. Prière par le prêtre Habimana Balthazar. Service par Alice et Gentille (deux verres et champagne)",
  },
  
  // 15h30 - Premier volet de danse
  {
    id: "dot-4",
    time: "15h30",
    event: "Danse traditionnelle d'accueil - Kwakira Abashyitsi 💃",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "15min",
    type: "entertainment",
    isPublic: true,
    details: "Musiques: Mwugurure abaraje - Massamba, Igikobwa - Charles Mwafrika",
  },
  
  // 15h45 - Échanges entre représentants
  {
    id: "dot-5",
    time: "15h45",
    event: "Dialogue des familles - Gufata Irembo",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "15min",
    type: "ceremony",
    isPublic: true,
    details: "Andersen donne la parole à Evariste (famille de Diane), suivi par Anastase (famille d'Emmanuel). Evariste termine par demander où est Emmanuel",
  },
  
  // 16h00 - Entrée d'Emmanuel
  {
    id: "dot-6",
    time: "16h00",
    event: "Entrée majestueuse du marié 🤵",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "30min",
    type: "ceremony",
    isPublic: true,
    details: "Musique: Akadege - Ruti Joel. Entrée solennelle d'Emmanuel accompagné de son cortège",
  },
  
  // 16h30 - Négociations et accord
  {
    id: "dot-7",
    time: "16h30",
    event: "Union des familles - Négociations traditionnelles",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "30min",
    type: "ceremony",
    isPublic: true,
    details: "Reprise des échanges entre les représentants. Négociations traditionnelles et accord final entre les deux familles",
  },
  
  // 17h00 - Deuxième volet de danse
  {
    id: "dot-8",
    time: "17h00",
    event: "Danse d'appel de la mariée - Guhamagara Umugeni 👰",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "15min",
    type: "entertainment",
    isPublic: true,
    details: "Musique: Arihehe - Massamba (intore). Danse traditionnelle pour appeler la mariée",
  },
  
  // 17h15 - Entrée officielle de Diane
  {
    id: "dot-9",
    time: "17h15",
    event: "Entrée triomphale de la mariée 👰‍♀️",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "30min",
    type: "ceremony",
    isPublic: true,
    details: "Musique: Tambuka - Victor Rukotana. Diane arrive avec ses filles d'honneur et sa marraine. Elle apporte des cadeaux à la famille d'Emmanuel. Evariste présente Emmanuel à Diane qui accepte de rejoindre sa famille",
  },
  
  // 17h45 - Troisième volet de danse
  {
    id: "dot-10",
    time: "17h45",
    event: "Célébration dansante - Kwakira Umugeni 🎉",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "45min",
    type: "entertainment",
    isPublic: true,
    details: "Musiques: Gasirabo dance (Filles et garçons), Ngwino mama - Ibihangange ft Ruti (Garçons), Urugo ni urukeye - Mpano Layan (Filles)",
  },
  
  // 18h30 - Kuvigira inka
  {
    id: "dot-11",
    time: "18h30",
    event: "Cérémonie traditionnelle de la dot - Kuvigira Inka 🐄",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "15min",
    type: "ceremony",
    isPublic: true,
    details: "Christian et Babi dirigent cette cérémonie traditionnelle symbolique de remise de la vache",
  },
  
  // 18h45 - Temps photos et cadeaux
  {
    id: "dot-12",
    time: "18h45",
    event: "Séance photos et remise de cadeaux 📸",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "45min",
    type: "photo",
    isPublic: true,
    details: "Distribution des cadeaux aux familles et photos. Rappel de la présence d'une urne. Photos: familles séparément, avec les amis, etc.",
  },
  
  // 19h30 - Photos couple (PRIVÉ)
  {
    id: "dot-13",
    time: "19h30",
    event: "Photos en intimité pour le couple",
    location: "Jardin du Domaine le plouy",
    duration: "30min",
    type: "photo",
    isPublic: false,
    details: "Temps de photo en intimité pour le couple dans le jardin. Pendant ce temps, service de l'apéritif pour les invités",
  },
  
  // 20h00 - Cadeaux pour les mamans
  {
    id: "dot-14",
    time: "20h00",
    event: "Hommage spécial aux mamans 💐",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "30min",
    type: "ceremony",
    isPublic: true,
    details: "Moment spécial de remise de cadeaux aux mamans des deux familles",
  },
  
  // 20h30 - Début du repas
  {
    id: "dot-15",
    time: "20h30",
    event: "Dîner de réception 🍽️",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "1h",
    type: "reception",
    isPublic: true,
    details: "Service de l'entrée à table. Buffet pour le reste (tables appelées par MC pour fluidifier). Animations surprises entre les plats",
  },
  
  // 21h30 - Quatrième volet de danse
  {
    id: "dot-16",
    time: "21h30",
    event: "Danse finale - Gusezera Umugeni 🕺",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "30min",
    type: "entertainment",
    isPublic: true,
    details: "Musiques: Urabeho nyamibwa ikeye (Filles), Warakoze de Jules Sentore puis Ganyobwe avec TOUT LE MONDE. MC annonce la fin de la cérémonie de dot mais précise que la fête continue",
  },
  
  // 22h00 - Mini ouverture de bal
  {
    id: "dot-17",
    time: "22h00",
    event: "Ouverture du bal des mariés 💃🕺",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "10min",
    type: "entertainment",
    isPublic: true,
    details: "Surprise de Diane et Emmanuel. Fumée au sol. Musique: Miriyoni INKI ft Ruti Joel. Moment de changement pour ceux qui le souhaitent, vidéobooth et DJ set",
  },
  
  // 22h10 - Lancement soirée dansante
  {
    id: "dot-18",
    time: "22h10",
    event: "Soirée dansante 🎉",
    location: "Domaine le plouy, 80140 VISMES",
    duration: "3h",
    type: "entertainment",
    isPublic: true,
    details: "Lancement officiel de la soirée jusqu'au bout de la nuit avec DJ set et animations",
  },
]