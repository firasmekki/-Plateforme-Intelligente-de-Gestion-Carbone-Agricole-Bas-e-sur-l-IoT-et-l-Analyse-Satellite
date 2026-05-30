# AgroCarbon Backend

API REST pour la plateforme de gestion carbone agricole AgroCarbon.

## 🚀 Technologies

- **Node.js** + Express
- **PostgreSQL** - Stockage utilisateurs et métadonnées
- **InfluxDB** - Données temporelles des capteurs IoT
- **JWT** - Authentification sécurisée
- **Multer** - Upload de fichiers
- **Winston** - Logging

## 📁 Structure

```
backend/
├── config/
│   ├── database.js      # Configuration PostgreSQL
│   └── influxdb.js      # Configuration InfluxDB
├── middleware/
│   └── error.middleware.js
├── routes/
│   ├── auth.routes.js    # Login/Register/JWT
│   ├── user.routes.js    # Gestion utilisateurs
│   ├── sensor.routes.js  # Données capteurs
│   └── report.routes.js  # Rapports et exports
├── utils/
│   └── logger.js
├── server.js
└── .env.example
```

## 🛠️ Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` basé sur `.env.example`:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=agrocarbon
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

INFLUX_URL=http://localhost:8086
INFLUX_TOKEN=your-token
INFLUX_ORG=agrocarbon
INFLUX_BUCKET=sensors
```

## 🐘 PostgreSQL Setup

```sql
CREATE DATABASE agrocarbon;
CREATE USER agrocarbon WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE agrocarbon TO agrocarbon;
```

## 📊 InfluxDB Setup

```bash
# Lancer InfluxDB
docker run -d --name influxdb \
  -p 8086:8086 \
  -v influxdb-data:/var/lib/influxdb2 \
  influxdb:2.7

# Créer un bucket et token via l'UI: http://localhost:8086
```

## ▶️ Démarrage

```bash
# Développement
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Créer compte
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Users (Admin)
- `GET /api/users` - Liste utilisateurs
- `GET /api/users/pending` - Clients en attente
- `PATCH /api/users/:id/approve` - Approuver client
- `PATCH /api/users/:id/reject` - Rejeter client

### Sensors
- `POST /api/sensors/data` - Envoyer données capteur
- `GET /api/sensors/carbon/:farmId` - Émissions carbone
- `GET /api/sensors/water/:farmId` - Consommation eau
- `GET /api/sensors/energy/:farmId` - Consommation énergie
- `POST /api/sensors/mqtt` - Webhook MQTT IoT

### Reports
- `GET /api/reports` - Liste rapports
- `POST /api/reports/generate/carbon` - Générer rapport carbone
- `POST /api/reports/upload` - Uploader fichier
- `GET /api/reports/download/:id` - Télécharger rapport

## 🔒 Sécurité

- JWT tokens avec expiration
- Rate limiting (100 req/15min)
- Helmet headers
- CORS configuré
- Validation des entrées
- Hash bcrypt passwords

## 📝 Logs

Les logs sont stockés dans `logs/`:
- `error.log` - Erreurs uniquement
- `combined.log` - Tous les logs
