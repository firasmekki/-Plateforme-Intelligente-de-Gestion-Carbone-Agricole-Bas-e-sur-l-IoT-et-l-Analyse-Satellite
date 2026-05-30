const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Créer la table users
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Table users créée');

    // Créer la table parcelles
    await query(`
      CREATE TABLE IF NOT EXISTS parcelles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        culture VARCHAR(100) NOT NULL,
        surface DECIMAL(10, 2) NOT NULL,
        carbon_emission DECIMAL(10, 2) NOT NULL,
        water_consumption DECIMAL(10, 2) NOT NULL,
        coordinates JSONB NOT NULL,
        color VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Table parcelles créée');

    // Créer l'utilisateur admin par défaut
    const adminEmail = 'admin@agrocarbon.com';
    const existingAdmin = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length === 0) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'CHANGE_THIS_PASSWORD';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await query(
        'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5)',
        ['Administrateur', adminEmail, hashedPassword, 'admin', 'active']
      );
      console.log('✅ Utilisateur admin créé: admin@agrocarbon.com');
    } else {
      console.log('ℹ️ Admin existe déjà');
    }

    // Créer l'utilisateur client de test
    const clientEmail = 'jean@gmail.com';
    const existingClient = await query('SELECT * FROM users WHERE email = $1', [clientEmail]);
    
    if (existingClient.rows.length === 0) {
      const clientPassword = process.env.CLIENT_PASSWORD || 'CHANGE_THIS_PASSWORD';
      const hashedPassword = await bcrypt.hash(clientPassword, 10);
      await query(
        'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5)',
        ['Jean Dupont', clientEmail, hashedPassword, 'client', 'active']
      );
      console.log('✅ Utilisateur client créé: jean@gmail.com');
    } else {
      console.log('ℹ️ Client existe déjà');
    }

    console.log('✅ Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initDatabase();
