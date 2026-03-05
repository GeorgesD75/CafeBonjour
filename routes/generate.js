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
    // Étape 1 : récupération des utilisateurs (Aperçu)
    // On utilise le jeton Application pour vérifier si le consentement Admin est effectif !
    const tenantId = req.session.account?.tenantId || process.env.TENANT_ID;
    const appToken = await getAccessToken(tenantId);

    const users = await getAllUsers(appToken);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé' });
    }

    // Étape 2 : génération des groupes (Aperçu)
    const groupes = createGroups(users);

    // Suppression de l'étape de sendMessages() : C'est la page web qui affiche l'aperçu,
    // on ne veut absolument PAS spammer l'entreprise entière lors du test visuel de l'admin.
    // L'envoi réel est strictement réservé au planificateur CRON (scheduler.js).

    // Résultat renvoyé à l’interface pour affichage visuel
    res.json({
      success: true,
      totalUsers: users.length,
      totalGroups: groupes.length,
      groups: groupes
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération de l\'aperçu des groupes :', error);
    res.status(500).json({
      error: 'Erreur lors de la génération',
      details: error.message
    });
  }
});

export default router;
