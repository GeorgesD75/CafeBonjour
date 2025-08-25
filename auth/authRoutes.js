import express from 'express';
import cca from './msalConfig.js';

const router = express.Router();

const SCOPES = ['User.Read', 'Chat.ReadWrite', 'User.ReadBasic.All'];

router.get('/login', (req, res) => {
  const authCodeUrlParams = {
    scopes: SCOPES,
    redirectUri: process.env.REDIRECT_URI,
  };

  console.log('🔍 redirectUri utilisé :', process.env.REDIRECT_URI);
  cca.getAuthCodeUrl(authCodeUrlParams).then((response) => {
    res.redirect(response);
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Erreur lors de la génération de l’URL d’auth');
  });
});

router.get('/redirect', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: SCOPES,
    redirectUri: process.env.REDIRECT_URI,
  };

  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    req.session.accessToken = response.accessToken;
    req.session.account = response.account;
    res.redirect('/auth/success');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de l’acquisition du token');
  }
});

router.get('/success', (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).send('Non connecté');
  }

  res.send(`
    <h1>Connexion réussie</h1>
    <p>Utilisateur : ${req.session.account.username}</p>
    <p><a href="/auth/token">Voir le token</a></p>
  `);
});

router.get('/token', (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Non connecté' });
  }
  res.json({ accessToken: req.session.accessToken });
});

export default router;
