// server.js - Serveur Express pour l'API
import express from 'express';
import generateRouter from './routes/generate.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/generate', generateRouter);

// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'CafeBonjour API', 
    endpoints: ['/api/generate'] 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});