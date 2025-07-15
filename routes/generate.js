const express = require('express');
const fs = require('fs');
const path = require('path');
const { createGroups } = require('../scripts/pairing');

const router = express.Router();

router.get('/', (req, res) => {
  const usersPath = path.join(__dirname, '..', 'users.json');
  const rawData = fs.readFileSync(usersPath);
  const users = JSON.parse(rawData);

  const groupes = createGroups(users);
  res.json(groupes);
});

module.exports = router;
