# ⭐ Yu-Gi-Oh! Collection Tracker

Application web gratuite et open-source pour gérer votre collection de cartes Yu-Gi-Oh avec plus de 12,000 cartes, synchronisation cloud et notifications automatiques.

![Yu-Gi-Oh Collection Tracker](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-Open%20Source-blue) ![PWA](https://img.shields.io/badge/PWA-Enabled-purple)

## ✨ Fonctionnalités

- 🎴 **12,000+ cartes** - Base de données complète en français avec images officielles
- ☁️ **Synchronisation cloud** - Code PIN unique pour accès multi-appareils
- 💝 **Liste de souhaits** - Gérez vos cartes recherchées avec raretés spécifiques
- 📊 **Statistiques complètes** - Suivi détaillé de votre collection
- 🔔 **Notifications automatiques** - Alertes pour les nouvelles cartes
- 📱 **PWA installable** - Fonctionne comme une app native sur mobile
- 🌐 **Hors ligne** - Utilisez l'app même sans connexion
- 🎨 **Interface moderne** - Design responsive et intuitive
- 💯 **100% Gratuit** - Sans publicité, sans version premium

## 🚀 Démarrage rapide

### Utilisation en ligne (Recommandé)

Visitez simplement : **[VOTRE_URL_VERCEL]**

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/VOTRE_USERNAME/yugioh-collection-tracker.git

# Aller dans le dossier
cd yugioh-collection-tracker

# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Technologies utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling moderne
- **Firebase** - Authentification et base de données
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation
- **Lucide Icons** - Icônes modernes
- **PWA** - Progressive Web App

## 🎯 Comment utiliser

### 1. Créer votre code PIN

1. Cliquez sur le bouton **"Cloud"** en haut à droite
2. Choisissez **"Créer un nouveau code PIN"**
3. Notez précieusement votre code à 6 chiffres
4. C'est votre identifiant unique !

### 2. Gérer votre collection

- **Recherchez** des cartes par nom
- **Filtrez** par type, race, attribut, archétype, extension, rareté
- **Cliquez sur la coche verte** pour marquer une carte comme possédée
- **Cliquez sur le cœur rose** pour l'ajouter à votre wishlist
- **Gérez les raretés** spécifiques de chaque carte
- **Ajustez les quantités** avec les boutons +/-

### 3. Synchronisation multi-appareils

Utilisez le même code PIN sur tous vos appareils (téléphone, tablette, PC) pour accéder à votre collection partout.

## 🔧 Configuration Firebase

L'application utilise Firebase pour la synchronisation cloud :

1. Créez un projet Firebase sur https://console.firebase.google.com
2. Activez **Authentication** → **Anonymous**
3. Créez une base de données **Firestore**
4. Configurez les règles Firestore :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collections/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Copiez vos clés Firebase dans `src/firebase.ts`

## 📊 API utilisée

L'application utilise l'API publique **YGOPRODeck** :
- URL : https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr
- Documentation : https://ygoprodeck.com/api-guide/

Les nouvelles cartes sont automatiquement ajoutées par l'équipe YGOPRODeck quelques jours/semaines après leur sortie officielle.

## 🌍 Déploiement

Voir le guide complet : [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

**En résumé :**
1. Créer un repository GitHub
2. Pousser le code
3. Connecter à Vercel
4. Déployer en 1 clic !

## 🎨 Personnalisation

### Modifier le thème

Les couleurs sont définies dans `/src/styles/theme.css`

### Ajouter des fonctionnalités

L'architecture est modulaire :
- `/src/app/pages/` - Pages principales
- `/src/app/components/` - Composants réutilisables
- `/src/pin-auth.ts` - Logique d'authentification
- `/src/firebase.ts` - Configuration Firebase

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est open-source et disponible pour tous.

## 🙏 Remerciements

- **YGOPRODeck** pour l'API gratuite
- **La communauté Yu-Gi-Oh** pour le support
- **Firebase** pour l'infrastructure gratuite
- **Vercel** pour l'hébergement gratuit

## 📧 Contact

Pour toute question ou suggestion, ouvrez une issue sur GitHub.

---

**Fait avec ❤️ pour la communauté Yu-Gi-Oh**

⭐ Si vous aimez ce projet, n'oubliez pas de lui donner une étoile sur GitHub !
