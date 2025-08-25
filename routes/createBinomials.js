// routes/createBinomials.js
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// POST /api/create-binomials
router.post('/create-binomials', async (req, res) => {
  const binomials = req.body.binomials;
  const accessToken = req.session.accessToken;

  if (!accessToken || !binomials) {
    return res.status(400).json({ error: 'accessToken et binomials requis.' });
  }

  try {
    const results = [];

    for (const pair of binomials) {
      const { user1Id, user2Id, message } = pair;

      // Création du chat privé
      const chatResponse = await fetch('https://graph.microsoft.com/v1.0/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatType: 'oneOnOne',
          members: [
            {
              '@odata.type': '#microsoft.graph.aadUserConversationMember',
              roles: ['owner'],
              "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${user1Id}')`
            },
            {
              '@odata.type': '#microsoft.graph.aadUserConversationMember',
              roles: ['owner'],
              "user@odata.bind": `https://graph.microsoft.com/v1.0/users('${user2Id}')`
            }
          ]
        })
      });

      if (!chatResponse.ok) {
        const error = await chatResponse.text();
        throw new Error(`Erreur création chat : ${error}`);
      }

      const chat = await chatResponse.json();

      // Envoi du message dans le chat
      const messageResponse = await fetch(`https://graph.microsoft.com/v1.0/chats/${chat.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: {
            content: message
          }
        })
      });

      if (!messageResponse.ok) {
        const error = await messageResponse.text();
        throw new Error(`Erreur envoi message : ${error}`);
      }

      results.push({ chatId: chat.id, status: 'ok' });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error('❌ Erreur dans /create-binomials :', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
