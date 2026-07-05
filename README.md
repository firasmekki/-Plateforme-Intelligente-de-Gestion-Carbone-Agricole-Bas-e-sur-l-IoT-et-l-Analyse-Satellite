<div align="center">

# 🌿 AgroCarbon
### Plateforme Intelligente de Gestion Carbone Agricole
#### Basée sur l'IoT et l'Analyse Satellite

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

*Plateforme full-stack de monitoring et d'optimisation de l'empreinte carbone des exploitations agricoles, intégrant l'analyse d'images satellite NDVI, les capteurs IoT en temps réel et un moteur de recommandations IA.*

</div>

---

## 📸 Aperçu

### Interface Administrateur

> **Dashboard Admin** — Vue d'ensemble des émissions carbone, KPIs et activité de l'équipe

<img width="2600" height="2324" alt="localhost_4000_client (10)" src="https://github.com/user-attachments/assets/050c854b-75a2-437f-882a-796d64f9e930" />


> **Gestion des Demandes de Comptes** — Approbation / rejet des inscriptions clients
<img width="2880" height="1938" alt="localhost_4000_admin_admin-users (1)" src="https://github.com/user-attachments/assets/e3d2f2eb-ac56-48e5-b9f1-395ecfbce79a" />


> **Carbone Agricole** — Suivi détaillé des émissions par exploitation et par type de culture
<img width="2600" height="2308" alt="localhost_4000_client (11)" src="https://github.com/user-attachments/assets/09f2a72f-0512-4a95-b775-166ba4eb37b2" />


> **Gestion des Capteurs IoT** — Supervision des capteurs terrain et données temps réel
<img width="2600" height="1734" alt="localhost_4000_client (17)" src="https://github.com/user-attachments/assets/a0219841-eb57-40f7-a6ec-29a1a5ea9c4a" />

---

### Interface Client
 
<img width="2600" height="2144" alt="localhost_4000_client" src="https://github.com/user-attachments/assets/3b862017-1a01-49c7-b448-4306e0b6207f" />


> **Satellite Farm** — Carte interactive avec analyse NDVI des parcelles et IA agronomique
<img width="2600" height="1678" alt="localhost_4000_client (4)" src="https://github.com/user-attachments/assets/cf746193-daff-4c27-be76-d80a4ec59782" />


> **Calculateur Carbone** — Estimation de l'empreinte carbone par poste (carburant, élevage, intrants…)
<img width="2600" height="3096" alt="localhost_4000_client (7)" src="https://github.com/user-attachments/assets/01107686-6c7b-4c4c-9550-e9da98d36836" />

> **Capteurs IoT** — Suivi des données terrain (température, humidité, CO₂…)
<img width="2600" height="1678" alt="localhost_4000_client (6)" src="https://github.com/user-attachments/assets/52d3c9ed-6103-42e4-9217-e0e2f1824f31" />

---

## 🏗️ Architecture

```
agrocarbon/
├── 📁 backend/                  # API REST Node.js / Express
│   ├── config/
│   │   ├── database.js          # Connexion PostgreSQL
│   │   └── influxdb.js          # Connexion InfluxDB (IoT)
│   ├── middleware/
│   │   ├── auth.middleware.js   # Vérification JWT
│   │   └── error.middleware.js  # Gestionnaire d'erreurs centralisé
│   ├── models/
│   │   ├── user.model.js        # Modèle utilisateur
│   │   └── parcelle.model.js    # Modèle parcelle agricole
│   ├── routes/
│   │   ├── auth.routes.js       # /api/auth — Connexion, inscription
│   │   ├── user.routes.js       # /api/users — Gestion utilisateurs
│   │   ├── sensor.routes.js     # /api/sensors — Données capteurs IoT
│   │   ├── parcelle.routes.js   # /api/parcelles — CRUD parcelles
│   │   └── report.routes.js     # /api/reports — Génération rapports
│   ├── utils/
│   │   └── logger.js            # Winston logger
│   ├── scripts/
│   │   └── init-db.js           # Initialisation base de données
│   ├── .env.example             # Template de configuration
│   └── server.js                # Point d'entrée Express
│
└── 📁 src/                      # Frontend React / TypeScript
    ├── components/
    │   ├── App.tsx              # Routeur principal (Admin / Client)
    │   ├── AdminLayout.tsx      # Layout administrateur
    │   ├── ClientDashboard.tsx  # Dashboard client personnalisé
    │   ├── SatelliteFarmV2.tsx  # Carte Leaflet + NDVI + IA
    │   ├── CalculateurCarbone.tsx
    │   ├── CapteursIoT.tsx
    │   ├── IrrigationPage.tsx
    │   ├── CarboneDetailPage.tsx
    │   ├── AdminUserManagement.tsx
    │   └── ...
    ├── services/
    │   ├── api.ts               # Client HTTP (fetch wrapper)
    │   └── satelliteService.ts  # Analyse NDVI async
    ├── auth/
    │   └── authStore.ts         # Gestion session utilisateur
    └── index.css                # Styles globaux + fixes Recharts
```

---

## ✨ Fonctionnalités

### 🔐 Authentification & Rôles
| Fonctionnalité | Admin | Client |
|---|:---:|:---:|
| Connexion sécurisée (JWT + bcrypt) | ✅ | ✅ |
| Gestion des demandes d'inscription | ✅ | — |
| Approbation / rejet des comptes clients | ✅ | — |
| Accès restreint selon le rôle | ✅ | ✅ |

### 🌍 Analyse Satellite (Satellite Farm)
- **Carte interactive** Leaflet avec tuiles satellite haute résolution (ArcGIS / Esri)
- **Dessin de parcelles** : traçage de polygones sur la carte, calcul automatique de la superficie (ha)
- **NDVI Heatmap** : superposition canvas rendu côté client avec gradient de couleurs (rouge → vert)
- **Analyse IA agronomique** en 4 colonnes :
  - Score de santé végétale (jauge SVG circulaire)
  - Actions prioritaires (Urgent / Action / Planifié / Critique)
  - Prévisions NDVI à J+7, J+15, J+30
  - Risques identifiés (stress hydrique, carence, maladie foliaire…)
- **4 onglets d'analyse** : Aperçu / Végétation / Tendance / Analyse IA
- Intégration optionnelle **Sentinel Hub API** pour imagerie satellite réelle

### 📡 Capteurs IoT
- Dashboard temps réel des capteurs terrain
- Historique des données (temperature, humidité du sol, CO₂, pluviométrie)
- Stockage time-series via **InfluxDB**
- Alertes de dépassement de seuils

### 🧮 Calculateur Carbone
- Estimation de l'empreinte carbone par poste :
  - Carburant & machinerie agricole
  - Élevage (émissions entériques + fumier)
  - Intrants (engrais azotés, pesticides)
  - Transport & logistique
  - Consommation énergétique
- Génération de rapports PDF (html2canvas)

### 📊 Dashboard & Analytics
- KPIs temps réel : émissions CO₂e, carburant, irrigation, objectifs
- Graphiques interactifs (Recharts) : barres, aires, courbes de tendance
- Suivi des objectifs de durabilité avec progression visuelle

### 🗺️ Gestion des Parcelles
- Vue admin : toutes les parcelles de tous les clients
- Vue client : ses propres parcelles avec statut et historique
- Carte des parcelles (CarteParcelles)

### 🌦️ Météo
- Widget météo intégré par géolocalisation

### 📄 Rapports
- Génération et consultation de rapports périodiques
- Export données carbone

---

## 🛠️ Stack Technique

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| React | 18.2 | UI Framework |
| TypeScript | 5.3 | Typage statique |
| Vite | 5.1 | Bundler & Dev Server |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Recharts | 3.x | Graphiques et visualisations |
| React-Leaflet | 4.2 | Cartographie interactive |
| Leaflet | 1.9 | Moteur de carte |
| Lucide React | 0.263 | Icônes SVG |
| html2canvas | 1.4 | Capture / export PDF |

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| Node.js | LTS | Runtime |
| Express | 4.18 | Framework REST |
| PostgreSQL | 14+ | Base de données relationnelle |
| InfluxDB | 2.x | Base time-series (IoT) |
| JSON Web Token | 9.x | Authentification |
| bcryptjs | 2.4 | Hachage des mots de passe |
| Helmet | 7.x | Sécurité HTTP headers |
| Winston | 3.x | Logging structuré |
| express-validator | 7.x | Validation des entrées |

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL ≥ 14 (optionnel — mode mock disponible)
- InfluxDB 2.x (optionnel — pour les données capteurs)

### 1. Cloner le dépôt
```bash
git clone https://github.com/firasmekki/-Plateforme-Intelligente-de-Gestion-Carbone-Agricole-Bas-e-sur-l-IoT-et-l-Analyse-Satellite.git
cd Plateforme-Intelligente-de-Gestion-Carbone-Agricole
```

### 2. Frontend — Installation
```bash
npm install
```

### 3. Backend — Installation
```bash
cd backend
npm install
```

### 4. Configuration de l'environnement
```bash
# Dans le dossier backend/
cp .env.example .env
```

Éditer `backend/.env` et renseigner :
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=<générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
POSTGRES_HOST=localhost
POSTGRES_DB=agrocarbon
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<votre_mot_de_passe>
```

### 5. Initialiser la base de données (optionnel)
```bash
cd backend
node scripts/init-db.js
```

### 6. Lancer l'application

**Terminal 1 — Backend :**
```bash
cd backend
npm run dev
# → API disponible sur http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
# Depuis la racine du projet
npm run dev
# → Application sur http://localhost:4000
```

---

## 🔑 Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@agrocarbon.com` | `admin123` |
| Client | `jean@gmail.com` | `client123` |
| Client | `marie@gmail.com` | `client123` |

> ⚠️ **Production** : Changer impérativement les mots de passe par défaut.

---

## 🌐 API REST

Base URL : `http://localhost:3001/api`

### Authentification
| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Inscription (client) | — |
| `POST` | `/auth/login` | Connexion | — |
| `GET` | `/auth/me` | Profil utilisateur courant | JWT |

### Utilisateurs (Admin)
| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/users` | Liste des utilisateurs | Admin |
| `PATCH` | `/users/:id/status` | Approuver / rejeter un compte | Admin |
| `DELETE` | `/users/:id` | Supprimer un utilisateur | Admin |

### Capteurs IoT
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/sensors` | Liste des capteurs |
| `GET` | `/sensors/:id/data` | Données historiques d'un capteur |
| `POST` | `/sensors/data` | Enregistrer une mesure |

### Parcelles
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/parcelles` | Liste des parcelles |
| `POST` | `/parcelles` | Créer une parcelle |
| `PUT` | `/parcelles/:id` | Modifier une parcelle |
| `DELETE` | `/parcelles/:id` | Supprimer une parcelle |

### Santé
| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Statut de l'API |

---

## 🔒 Sécurité

- **Variables d'environnement** : tous les secrets dans `backend/.env` (ignoré par `.gitignore`)
- **JWT** : tokens signés HS256, expiration configurable (défaut 7 jours)
- **Mots de passe** : hachés avec bcrypt (salt rounds = 10)
- **Helmet.js** : headers HTTP de sécurité (CSP, HSTS, X-Frame-Options…)
- **express-validator** : validation et sanitisation de toutes les entrées utilisateur
- **CORS** : origines autorisées configurables via `FRONTEND_URL`
- **Rate limiting** : disponible (commenté en dev, à activer en production)

### ⚠️ Avant de mettre en production
- [ ] Générer un nouveau `JWT_SECRET` (min. 64 caractères aléatoires)
- [ ] Changer les mots de passe par défaut (`admin123`, `client123`)
- [ ] Activer le rate limiting dans `server.js`
- [ ] Configurer `FRONTEND_URL` avec le domaine de production
- [ ] Restreindre les origines CORS
- [ ] Activer HTTPS (Let's Encrypt / Nginx)
- [ ] Remplacer les mocks par la base PostgreSQL réelle

---

## 📁 Ajouter des captures d'écran

Pour rendre ce README complet, créer le dossier `docs/screenshots/` et y placer :

```
docs/screenshots/
├── admin-dashboard.png      # Dashboard admin (KPIs + graphiques)
├── admin-users.png          # Gestion des demandes de comptes
├── admin-carbone.png        # Page Carbone Agricole
├── admin-capteurs.png       # Gestion des capteurs IoT
├── client-dashboard.png     # Dashboard client
├── client-satellite.png     # Satellite Farm (carte + analyse IA)
├── client-calculateur.png   # Calculateur carbone
└── client-capteurs.png      # Capteurs IoT client
``
