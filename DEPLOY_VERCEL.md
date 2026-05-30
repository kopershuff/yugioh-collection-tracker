# 🚀 Guide de déploiement sur Vercel

Ce guide vous explique comment déployer votre application Yu-Gi-Oh Collection Tracker sur Vercel en quelques minutes.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit) - https://vercel.com

## 🎯 Étapes de déploiement

### 1. Créer un repository GitHub

1. Allez sur https://github.com/new
2. Nommez votre repository : `yugioh-collection-tracker`
3. Laissez-le **Public** (pour le partage communautaire)
4. Cliquez sur **"Create repository"**

### 2. Pousser votre code sur GitHub

Ouvrez le terminal dans votre projet et exécutez :

```bash
# Initialiser git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Yu-Gi-Oh Collection Tracker"

# Lier au repository GitHub (remplacez VOTRE_USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/VOTRE_USERNAME/yugioh-collection-tracker.git

# Pousser le code
git branch -M main
git push -u origin main
```

### 3. Déployer sur Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"New Project"**
3. Cliquez sur **"Import Git Repository"**
4. Sélectionnez votre repository `yugioh-collection-tracker`
5. **Configuration du projet :**
   - Framework Preset : **Vite**
   - Build Command : `pnpm build` (auto-détecté)
   - Output Directory : `dist` (auto-détecté)
   - Install Command : `pnpm install` (auto-détecté)

6. Cliquez sur **"Deploy"**

⏳ Le déploiement prend environ 2-3 minutes.

### 4. Votre app est en ligne ! 🎉

Une fois le déploiement terminé, vous obtiendrez une URL du type :
- `https://yugioh-collection-tracker.vercel.app`
- Ou `https://votre-projet-xyz.vercel.app`

## 🌐 Domaine personnalisé (Optionnel)

Pour avoir un domaine plus court :

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé (ex: `yugicollection.fr`)
3. Suivez les instructions DNS

**Où acheter un domaine ?**
- OVH (~10€/an pour .fr)
- Namecheap (~12€/an pour .com)
- Google Domains

## 🔄 Mises à jour automatiques

Chaque fois que vous poussez du code sur GitHub :
```bash
git add .
git commit -m "Amélioration X"
git push
```

Vercel redéploiera automatiquement votre app ! ✨

## 🔧 Variables d'environnement

Votre configuration Firebase est déjà dans le code, rien à configurer !

Si vous voulez sécuriser davantage :
1. Dans Vercel : **Settings** → **Environment Variables**
2. Ajoutez vos clés Firebase
3. Modifiez `src/firebase.ts` pour utiliser `process.env.VITE_FIREBASE_API_KEY`

## 📊 Monitoring

Vercel vous offre gratuitement :
- ✅ Analytics
- ✅ Logs en temps réel
- ✅ Métriques de performance
- ✅ Nombre de visiteurs

Accessible dans : **Analytics** et **Logs**

## ⚡ Optimisations automatiques

Vercel optimise automatiquement :
- Compression des assets
- CDN global
- Cache intelligent
- HTTPS automatique
- Déploiements instantanés

## 🆘 Problèmes courants

### Erreur "Command not found: pnpm"

Dans Vercel Settings → General :
- Install Command : `npm install -g pnpm && pnpm install`

### Erreur de build

Vérifiez que votre `package.json` contient bien :
```json
"scripts": {
  "build": "vite build"
}
```

### Routes 404

Le fichier `vercel.json` est déjà configuré pour gérer le routing React.

## 📱 Tester en local

Avant de déployer, testez localement :

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Build de production (comme Vercel)
pnpm build
pnpm preview
```

## 🎯 Prochaines étapes

Une fois déployé :

1. ✅ Partagez l'URL sur Reddit r/yugioh
2. ✅ Ajoutez l'URL dans votre profil Discord
3. ✅ Créez une vidéo YouTube de démonstration
4. ✅ Partagez sur Twitter avec #YuGiOh #TCG

---

**Besoin d'aide ?**
- Documentation Vercel : https://vercel.com/docs
- Support Vercel : https://vercel.com/support

**Bon déploiement ! 🚀**
