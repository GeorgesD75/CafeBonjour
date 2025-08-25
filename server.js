import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import authRoutes from './auth/authRoutes.js';
import generateRouter from './routes/generate.js';
import userRoutes from './routes/users.js';

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

// Default
app.get('/', (req, res) => {
  res.send(`<h1>Café Bonjour</h1><a href="/auth/login">Se connecter à Microsoft</a>`);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
