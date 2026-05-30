const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware');

// Mock data pour tester - en production, utiliser PostgreSQL
let parcelles = [
  {
    id: 'P1',
    name: 'Champ Blé - Nord',
    userId: 2, // Jean
    culture: 'Blé',
    surface: 12.5,
    carbonEmission: 450,
    waterConsumption: 320,
    coordinates: { x: 10, y: 10, width: 35, height: 25 },
    color: '#22c55e',
    createdAt: new Date().toISOString()
  }
];

// GET /api/parcelles/my - Récupérer les parcelles du client connecté
router.get('/my', requireAuth, (req, res) => {
  const userId = req.user.id;
  const userParcelles = parcelles.filter(p => p.userId === userId);
  res.json({ success: true, parcelles: userParcelles });
});

// GET /api/parcelles - Admin: toutes les parcelles
router.get('/', requireAuth, requireAdmin, (req, res) => {
  res.json({ success: true, parcelles });
});

// POST /api/parcelles - Créer une nouvelle parcelle
router.post('/', requireAuth, (req, res) => {
  const { name, culture, surface, carbonEmission, waterConsumption, coordinates, color } = req.body;
  
  const newParcelle = {
    id: `P${Date.now()}`,
    userId: req.user.id,
    name,
    culture,
    surface,
    carbonEmission,
    waterConsumption,
    coordinates,
    color,
    createdAt: new Date().toISOString()
  };
  
  parcelles.push(newParcelle);
  res.status(201).json({ success: true, parcelle: newParcelle });
});

// DELETE /api/parcelles/:id - Supprimer une parcelle
router.delete('/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';
  
  const index = parcelles.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Parcelle non trouvée' });
  }
  
  // Vérifier que l'utilisateur est propriétaire ou admin
  if (parcelles[index].userId !== userId && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Non autorisé' });
  }
  
  parcelles.splice(index, 1);
  res.json({ success: true, message: 'Parcelle supprimée' });
});

module.exports = router;
