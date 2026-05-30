# 🚀 AgroCarbon - Démarrage Backend

Guide pour lancer le backend et connecter le frontend.

---

## 📦 Étape 1: Installer les dépendances Backend

```bash
cd backend
npm install
```

---

## 🐘 Étape 2: Configurer PostgreSQL

### Option A: PostgreSQL local
```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE agrocarbon;"
psql -U postgres -c "CREATE USER agrocarbon WITH PASSWORD 'password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE agrocarbon TO agrocarbon;"
```

### Option B: Docker
```bash
docker run -d \
  --name postgres-agrocarbon \
  -e POSTGRES_DB=agrocarbon \
  -e POSTGRES_USER=agrocarbon \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

---

## 📊 Étape 3: Configurer InfluxDB

### Docker (recommandé)
```bash
docker run -d \
  --name influxdb-agrocarbon \
  -p 8086:8086 \
  -v influxdb-data:/var/lib/influxdb2 \
  influxdb:2.7
```

### Créer le bucket et token
1. Aller sur http://localhost:8086
2. Créer un compte (setup initial)
3. Créer un bucket nommé `sensors`
4. Générer un token API
5. Copier le token

---

## ⚙️ Étape 4: Configuration .env

```bash
cd backend
cp .env.example .env
```

Éditer `.env`:
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=7d

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=agrocarbon
POSTGRES_USER=agrocarbon
POSTGRES_PASSWORD=password

INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-token-from-influxdb
INFLUX_ORG=agrocarbon
INFLUX_BUCKET=sensors
```

---

## ▶️ Étape 5: Démarrer le Backend

```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur http://localhost:3001

Testez: http://localhost:3001/api/health

---

## 🎨 Étape 6: Configurer le Frontend

```bash
cd ..
```

Créer `.env` à la racine du projet:
```env
VITE_API_URL=http://localhost:3001/api
```

Lancer le frontend:
```bash
npm run dev
```

---

## 🧪 Tests API

### Inscription
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123","role":"client"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## 📡 Endpoints API Disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Créer compte |
| `/api/auth/login` | POST | Connexion JWT |
| `/api/auth/me` | GET | Profil utilisateur |
| `/api/users` | GET | Liste utilisateurs (admin) |
| `/api/users/pending` | GET | Clients en attente (admin) |
| `/api/users/:id/approve` | PATCH | Approuver client (admin) |
| `/api/sensors/carbon/:farmId` | GET | Émissions carbone |
| `/api/sensors/water/:farmId` | GET | Consommation eau |
| `/api/sensors/energy/:farmId` | GET | Consommation énergie |
| `/api/reports` | GET | Liste rapports |
| `/api/reports/generate/carbon` | POST | Générer rapport carbone |
| `/api/reports/upload` | POST | Uploader fichier |

---

## 🔒 Sécurité Implémentée

✅ JWT Authentication
✅ Password hashing (bcrypt)
✅ Rate limiting (100 req/15min)
✅ Helmet security headers
✅ CORS protection
✅ Input validation
✅ File upload restrictions

---

## 🐛 Dépannage

### Erreur: "Cannot find module"
```bash
cd backend
rm -rf node_modules
npm install
```

### Erreur PostgreSQL: "Connection refused"
- Vérifier que PostgreSQL est démarré
- Vérifier les credentials dans `.env`

### Erreur InfluxDB: "Unauthorized"
- Vérifier le token dans `.env`
- Recréer le bucket et token via UI

---

## 📊 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│    API      │────▶│  PostgreSQL │
│  (React)    │◀────│  (Express)  │◀────│   (Users)   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   InfluxDB  │
                    │  (Sensors)  │
                    └─────────────┘
```

---

## 📝 Prochaines Étapes

1. ✅ Backend API
2. ✅ Frontend connecté
3. 🔄 Prochain: Fonctionnalités Agriculture Spécifiques
4. 🔄 Prochain: Améliorations UI/UX
5. 🔄 Prochain: Déploiement
