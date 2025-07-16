import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createGroups } from '../scripts/pairing.js';

const router = express.Router();

// Pour remplacer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
  const usersPath = path.join(__dirname, '..', 'users.json');
  const rawData = fs.readFileSync(usersPath);
  const users = JSON.parse(rawData);

  const groupes = createGroups(users);
  res.json(groupes);
});

export default router;
