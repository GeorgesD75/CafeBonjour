import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './auth/authRoutes.js';
import generateRouter from './routes/generate.js';
import userRoutes from './routes/users.js';
import { getSettings, saveSettings } from './scripts/db.js';
import { schedulePairingJob } from './scripts/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false // Permet le chargement du JS côté client (Vite/React) sans être bloqué
}));
// Prévention DDOS / Payload trop larges
app.use(express.json({ limit: '10kb' }));

// Protection Session (XSS, CSRF, Secure)
app.use(session({
  secret: process.env.SESSION_SECRET || 'cafe_bonjour_secret_production_2026',
  resave: false,
  saveUninitialized: true, // Ou false selon les politiques de cookies
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Uniquement sur HTTPS en PROD (Azure)
    httpOnly: true, // Interdit le vol de token via document.cookie (XSS)
    sameSite: 'lax', // Prévient la perte de cookie au retour de Microsoft
    maxAge: 24 * 60 * 60 * 1000 // 24h d'expiration
  }
}));

// Protection Brute-Force / Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Limite max par IP
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});

// Routes
app.use('/auth', apiLimiter, authRoutes);
app.use('/api', apiLimiter); // Appliqué en cascade sur /api
app.use('/api/generate', generateRouter);
app.use('/generate', generateRouter);
app.use('/users', userRoutes);

app.get('/api/settings', async (req, res) => {
  if (!req.session.account) return res.status(401).json({ error: 'Non connecté' });
  const tenantId = req.session.account.tenantId;

  const settings = await getSettings(tenantId);
  res.json(settings);
});

app.post('/api/settings', async (req, res) => {
  if (!req.session.account) return res.status(401).json({ error: 'Non connecté' });
  const tenantId = req.session.account.tenantId;

  try {
    await saveSettings(tenantId, req.body);
    await schedulePairingJob(); // On reprogramme le bot
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur sauvegarde' });
  }
});

// Default - Gestion du Frontend
app.use(express.static(path.join(__dirname, 'cafe-bonjour', 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'cafe-bonjour', 'dist', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  await schedulePairingJob(); // Démarrage du CRON local
});
