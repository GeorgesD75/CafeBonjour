// routes/users.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const token = req.session.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Non connecté' });
  }

  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const users = response.data.value.map(user => ({
      id: user.id,
      displayName: user.displayName,
      mail: user.mail
    }));

    res.json(users);
  } catch (error) {
    console.error('Erreur Graph /users:', error.response?.data || error);
    res.status(500).json({ error: 'Erreur récupération utilisateurs' });
  }
});

export default router;
