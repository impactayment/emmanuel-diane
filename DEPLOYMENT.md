# Configuration du Déploiement Vercel

## ✅ Étapes Complétées

1. **Repository GitHub** : https://github.com/impactayment/emmanuel-diane (privé)
2. **GitHub Actions** : Workflow configuré dans `.github/workflows/deploy.yml`
3. **Configuration Vercel** : `vercel.json` créé

## 📋 Étapes à Compléter sur Vercel

### 1. Créer le Projet Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec le compte GitHub impactayment
3. Cliquer sur "New Project"
4. Importer le repo `impactayment/emmanuel-diane`
5. **Nom du projet** : `emmanuel-diane`
6. **Framework** : Next.js (sera détecté automatiquement)

### 2. Configurer les Variables d'Environnement

Dans les settings du projet Vercel, ajouter :

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

(Récupérer la valeur depuis le fichier `/lib/db.ts`)

### 3. IDs pour GitHub Actions

Configuration Vercel obtenue :

1. **Project ID** : `prj_pyhGrLneMIOVJ39MaQyHWtalUoHZ`
2. **Org ID** : `team_MbARi9yMJcOlU16X5762XWhD`
3. **Token** : Créer sur https://vercel.com/account/tokens

### 4. Configurer les Secrets GitHub

Dans le repo GitHub (Settings > Secrets > Actions), ajouter :

- `VERCEL_TOKEN` : Token créé à l'étape 3
- `VERCEL_ORG_ID` : ID de l'organisation Vercel
- `VERCEL_PROJECT_ID` : ID du projet Vercel

## 🚀 Déploiement Automatique

Une fois configuré, chaque push sur `main` déclenchera automatiquement :
1. Build sur Vercel
2. Déploiement en production
3. URL publique : `https://emmanuel-diane.vercel.app`

## 📝 Commandes Utiles

```bash
# Vérifier le statut du déploiement
gh workflow view "Vercel Production Deployment"

# Déclencher manuellement un déploiement
gh workflow run deploy.yml

# Voir les logs du dernier déploiement
gh run list --workflow=deploy.yml
```

## 🔗 URLs

- **Repository** : https://github.com/impactayment/emmanuel-diane
- **Site en Production** : https://emmanuel-diane.vercel.app (après configuration)
- **Dashboard Vercel** : https://vercel.com/impactayment/emmanuel-diane