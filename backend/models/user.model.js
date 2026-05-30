const { Pool } = require('pg');
const pool = require('../config/database');

class User {
  // Créer un nouvel utilisateur
  static async create({ name, email, password, role = 'client' }) {
    const query = `
      INSERT INTO users (name, email, password, role, status, created_at)
      VALUES ($1, $2, $3, $4, 'pending', NOW())
      RETURNING id, name, email, role, status, created_at
    `;
    const values = [name, email, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Trouver par email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Trouver par ID
  static async findById(id) {
    const query = 'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Récupérer tous les utilisateurs (admin)
  static async findAll() {
    const query = 'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // Récupérer les utilisateurs en attente
  static async findPending() {
    const query = 'SELECT id, name, email, role, status, created_at FROM users WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, ['pending']);
    return result.rows;
  }

  // Approuver un utilisateur
  static async approve(id) {
    const query = 'UPDATE users SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, ['active', id]);
    return result.rows[0];
  }

  // Rejeter un utilisateur
  static async reject(id) {
    const query = 'UPDATE users SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, ['rejected', id]);
    return result.rows[0];
  }

  // Créer la table si elle n'existe pas
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await pool.query(query);
    console.log('✅ Table users créée/vérifiée');
  }
}

module.exports = User;
