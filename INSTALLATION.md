# Guide d'installation - Coach Fit Squad Builder

## 🚀 Installation rapide

### Étape 1 : Vérifier les prérequis

1. **Node.js** (version 16 ou supérieure)

   - Télécharger depuis : https://nodejs.org/
   - Vérifier l'installation : `node --version`

2. **MongoDB** (optionnel pour le test)
   - Option 1 : MongoDB local - https://www.mongodb.com/try/download/community
   - Option 2 : MongoDB Atlas (cloud) - https://www.mongodb.com/cloud/atlas

### Étape 2 : Installation du projet

```bash
# 1. Naviguer vers le dossier du projet
cd "c:\Users\mahro\Desktop\DEVLOPPEMENT\coach-fit-squad-builder-main"

# 2. Installer les dépendances du frontend
npm install

# 3. Installer les dépendances du backend
cd backend
npm install
cd ..
```

### Étape 3 : Configuration

1. **Configuration du backend**

   - Fichier : `backend\.env`
   - Contenu :

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/coach-fit-squad-builder
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Configuration du frontend**
   - Fichier : `.env`
   - Contenu :
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Coach Fit Squad Builder
   VITE_APP_VERSION=1.0.0
   ```

### Étape 4 : Démarrage

#### Option A : Démarrage automatique (Windows)

```bash
# Utiliser le script de démarrage
start.bat
```

#### Option B : Démarrage manuel

1. **Terminal 1 - Backend**

   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend**
   ```bash
   npm run dev
   ```

### Étape 5 : Test de l'installation

1. **Frontend** : Ouvrir http://localhost:5173
2. **Backend API** : Ouvrir http://localhost:5000/api/health

### Étape 6 : Données de test (optionnel)

Si MongoDB est installé :

```bash
cd backend
npm run seed
```

**Identifiants de test :**

- Email : coach@demo.com
- Mot de passe : password123

## 🔧 Résolution des problèmes

### Problème : Port déjà utilisé

```bash
# Changer le port dans backend\.env
PORT=5001
```

### Problème : MongoDB non disponible

L'application peut fonctionner sans MongoDB pour les tests du frontend.
Utiliser MongoDB Atlas pour une solution cloud.

### Problème : Erreur de module

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📝 Commandes utiles

```bash
# Vérifier les versions
node --version
npm --version

# Nettoyer les dépendances
npm cache clean --force

# Redémarrer les serveurs
# Ctrl+C pour arrêter, puis relancer les commandes
```

## 🎯 Prochaines étapes

1. Tester la connexion/inscription
2. Créer un client
3. Générer un programme
4. Explorer le dashboard

## 📞 Support

En cas de problème :

1. Vérifier les logs dans les terminaux
2. Consulter la documentation API
3. Vérifier les variables d'environnement
