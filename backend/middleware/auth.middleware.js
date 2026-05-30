const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Mock users (sans PostgreSQL pour test)
const mockUsers = [
  { id: 1, name: 'Administrateur', email: 'admin@agrocarbon.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jean Dupont', email: 'jean@gmail.com', role: 'client', status: 'active' },
  { id: 3, name: 'Marie Martin', email: 'marie@gmail.com', role: 'client', status: 'active' }
];

// Middleware d'authentification
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Bearer token');
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token received:', token.substring(0, 20) + '...');
    
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token decoded:', decoded);
    
    // Récupérer l'utilisateur depuis Mock data
    const user = mockUsers.find(u => u.id === decoded.userId);
    console.log('👤 User found:', user ? user.name : 'Not found');
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Compte non actif' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès admin requis' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin, JWT_SECRET };
