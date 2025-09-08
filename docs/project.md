Résumé du projet:
  Site web de mariage pour Emmanuel et Diane (14 septembre 2025) construit avec Next.js, TypeScript, Tailwind CSS et PostgreSQL. Déployé sur Vercel avec protection par mot de passe via GitHub Actions.

  Architecture principale:
  - Frontend: Next.js App Router avec composants shadcn/ui
  - Base de données: PostgreSQL via Neon (pool de connexions)
  - Styling: Tailwind CSS avec thème personnalisé rose/purple
  - Déploiement: Vercel avec workflow GitHub Actions pour la protection

  Composants clés:
  1. Hero: Page d'accueil avec compte à rebours et navigation
  2. Timeline: Programme de la journée avec 2 vues (invités/privé) et gestion temps réel
  3. WeddingGame: Jeu interactif multi-phases (actuellement caché)
  4. Locations, Team, OurStory: Sections informatives

  Fonctionnalités avancées:
  - Synchronisation temps réel des statuts d'événements
  - Météo en temps réel pour Vismes
  - Système de notifications sonores
  - Mode hors ligne avec persistance locale
  - Indicateurs "MAINTENANT"/"BIENTÔT" qui suivent la progression temporelle

  Modifications récentes:
  - Suppression du bouton et section "Jeu des mariés" (commits récents)
  - Ajout workflow GitHub Actions pour protection Vercel
  - Amélioration UI avec design plus élégant
  - Intégration complète du programme de la cérémonie du dot

  Base de données (4 tables):
  - events_state: Statuts des événements
  - game_registrations: Inscriptions au jeu
  - game_progress: Progression du jeu par table
  - game_config: Configuration du jeu

  État actuel:
  Le projet est fonctionnel avec un système de timeline sophistiqué permettant le suivi en temps réel. Le jeu a été récemment caché mais reste dans le code. L'authentification (mot de passe: FD2025) permet l'accès au programme privé et la modification des statuts.