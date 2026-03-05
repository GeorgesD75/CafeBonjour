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
  if (req.query.admin_consent === 'True') {
    console.log("✅ Consentement admin accordé pour le tenant:", req.query.tenant);
    // Redirection magique vers /login pour forcer la régénération silencieuse 
    // du Cookie de Session qui est souvent perdu à cause de "SameSite=Lax" par defaut.
    return res.redirect('/auth/login');
  }

  const tokenRequest = {
    code: req.query.code,
    scopes: SCOPES,
    redirectUri: process.env.REDIRECT_URI,
  };

  try {
    const response = await cca.acquireTokenByCode(tokenRequest);
    req.session.accessToken = response.accessToken;
    req.session.account = response.account;
    res.redirect(process.env.FRONTEND_URL || '/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de l’acquisition du token');
  }
});

router.get('/token', (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Non connecté' });
  }
  res.json({ accessToken: req.session.accessToken });
});

router.get('/admin-consent', (req, res) => {
  // Utilisation intelligente du tenantId de l'utilisateur déjà connecté (s'il l'est)
  const tenant = req.session?.account?.tenantId || process.env.TENANT_ID || 'common';
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3000/auth/redirect';

  // URL officielle Microsoft pour octroyer les permissions d'Application (Chat.Create etc...)
  const adminConsentUrl = `https://login.microsoftonline.com/${tenant}/adminconsent?client_id=${clientId}&redirect_uri=${redirectUri}`;

  res.redirect(adminConsentUrl);
});

router.get('/me', (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Non connecté' });
  }
  res.json({ account: req.session.account });
});

export default router;
