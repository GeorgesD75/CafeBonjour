// routes/generate.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createGroups } from '../scripts/pairing.js';

const router = express.Router();

// Pour remplacer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', async (req, res) => {
  try {
    const usersPath = path.join(__dirname, '..', 'users.json');
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(usersPath)) {
      return res.status(404).json({ 
        error: 'Fichier users.json introuvable' 
      });
    }
    
    const rawData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(rawData);
    
    const groupes = createGroups(users);
    
    res.json({
      success: true,
      totalUsers: users.length,
      totalGroups: groupes.length,
      groups: groupes
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération des groupes:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération des groupes',
      details: error.message 
    });
  }
});

export default router;