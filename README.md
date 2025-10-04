# Coach Fit Squad Builder

Une application complète pour les coachs fitness permettant de gérer leurs clients et de créer des programmes d'entraînement personnalisés.

## 🚀 Fonctionnalités

- **Gestion des clients** : Créer, modifier et suivre les profils clients
- **Programmes d'entraînement** : Créer des programmes personnalisés
- **Suivi des progrès** : Tracker l'évolution des clients
- **Authentification** : Système sécurisé avec JWT
- **Interface moderne** : Design responsive avec Tailwind CSS
- **API REST** : Backend robuste avec Node.js et MongoDB

## 🛠️ Technologies utilisées

### Frontend

- **React 18** avec TypeScript
- **Vite** pour le build
- **Tailwind CSS** pour le styling
- **Shadcn/ui** pour les composants
- **React Router** pour la navigation
- **React Query** pour la gestion des données

### Backend

- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe
- **Express Validator** pour la validation des données
- **Helmet** pour la sécurité

## 📦 Installation

### Installation automatique (Windows)

```bash
# Cloner le repository
git clone <repository-url>
cd coach-fit-squad-builder-main

# Lancer l'installation automatique
setup.bat
```

### Installation manuelle

#### Prérequis

- Node.js (v16 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd backend
npm install
```

## ⚙️ Configuration

### Backend

1. Créer un fichier `.env` dans le dossier `backend` :

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coach-fit-squad-builder
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend

1. Créer un fichier `.env` dans le dossier racine :

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Coach Fit Squad Builder
VITE_APP_VERSION=1.0.0
```

## 🗄️ Base de données

### MongoDB local

```bash
# Démarrer MongoDB
# Windows
net start MongoDB

# macOS/Linux
sudo service mongod start
```

### Seed de données de test

```bash
cd backend
npm run seed
```

## 🏃‍♂️ Démarrage

### Démarrage automatique (Windows)

```bash
start.bat
```

### Démarrage manuel

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

L'application sera disponible sur :

- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## 👤 Compte de test

Après avoir exécuté le seed :

- **Email** : coach@demo.com
- **Mot de passe** : password123

## 📁 Structure du projet

```
coach-fit-squad-builder-main/
├── backend/                    # API Backend
│   ├── models/                # Modèles MongoDB
│   ├── routes/                # Routes API
│   ├── middleware/            # Middleware Express
│   ├── config/                # Configuration
│   ├── utils/                 # Utilitaires
│   └── server.js              # Serveur principal
├── src/                       # Frontend React
│   ├── components/            # Composants React
│   ├── pages/                 # Pages
│   ├── contexts/              # Contextes React
│   ├── services/              # Services API
│   └── lib/                   # Utilitaires
├── public/                    # Ressources statiques
└── setup.bat                  # Installation automatique
```

## 🔐 API Endpoints

### Authentification

- `POST /api/users/register` - Inscription
- `POST /api/users/login` - Connexion
- `GET /api/users/profile` - Profil utilisateur
- `GET /api/users/verify` - Vérification du token

### Clients

- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Programmes

- `GET /api/programs` - Liste des programmes
- `POST /api/programs` - Créer un programme
- `PUT /api/programs/:id` - Modifier un programme
- `DELETE /api/programs/:id` - Supprimer un programme

## 🛡️ Sécurité

- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Validation des données
- Protection CORS
- Rate limiting
- Sécurisation des en-têtes avec Helmet

## 📝 Scripts disponibles

### Frontend

- `npm run dev` - Démarrage en développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build

### Backend

- `npm run dev` - Démarrage en développement
- `npm start` - Démarrage en production
- `npm run seed` - Seed de la base de données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre feature
3. Committer vos changements
4. Pusher vers la branche
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3507c3f1-0f34-48f7-8aba-f7b9a305cb7c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3507c3f1-0f34-48f7-8aba-f7b9a305cb7c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
