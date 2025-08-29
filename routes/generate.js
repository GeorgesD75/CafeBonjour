// routes/generate.js
import express from 'express';
import { createGroups } from '../scripts/pairing.js';
import { getAllUsers } from '../auth/graph.js';
import { getAccessToken } from '../auth/msalConfig.js';
import { sendMessages } from '../scripts/sendMessages.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const token = req.session.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Non connecté' });
  }

  try {
    // Étape 1 : récupération des utilisateurs
    const users = await getAllUsers(token);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé' });
    }

    // Étape 2 : génération des groupes
    const groupes = createGroups(users);

    // Étape 3 : acquisition d’un token valide pour envoyer les messages
    const accessToken = await getAccessToken(); // Token d'application

    // Étape 4 : envoi des messages dans Teams
    await sendMessages(groupes, accessToken);

    // Résultat renvoyé à l’utilisateur
    res.json({
      success: true,
      totalUsers: users.length,
      totalGroups: groupes.length,
      groups: groupes
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération des groupes ou de l’envoi de messages :', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération ou de l’envoi',
      details: error.message 
    });
  }
});

export default router;
