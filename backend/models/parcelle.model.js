const pool = require('../config/database');

class Parcelle {
  // Créer une nouvelle parcelle
  static async create({ userId, name, culture, surface, carbonEmission, waterConsumption, coordinates, color }) {
    const query = `
      INSERT INTO parcelles (user_id, name, culture, surface, carbon_emission, water_consumption, coordinates, color, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    const values = [userId, name, culture, surface, carbonEmission, waterConsumption, JSON.stringify(coordinates), color];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Trouver toutes les parcelles d'un utilisateur
  static async findByUserId(userId) {
    const query = 'SELECT * FROM parcelles WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Trouver une parcelle par ID
  static async findById(id) {
    const query = 'SELECT * FROM parcelles WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Récupérer toutes les parcelles (admin)
  static async findAll() {
    const query = `
      SELECT p.*, u.name as user_name, u.email as user_email 
      FROM parcelles p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Supprimer une parcelle
  static async delete(id) {
    const query = 'DELETE FROM parcelles WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Compter les parcelles d'un utilisateur
  static async countByUserId(userId) {
    const query = 'SELECT COUNT(*) FROM parcelles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  // Créer la table si elle n'existe pas
  static async createTable() {
    const query = `
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
    `;
    await pool.query(query);
    console.log('✅ Table parcelles créée/vérifiée');
  }
}

module.exports = Parcelle;
