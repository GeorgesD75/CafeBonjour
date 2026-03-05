import express from 'express';
import session from 'express-session';
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

app.use(express.json());
app.use(session({
  secret: 'cafe_bonjour_secret',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.use('/auth', authRoutes);
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
