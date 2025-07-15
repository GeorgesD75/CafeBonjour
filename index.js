/* require('dotenv').config();
const fetch = require('node-fetch'); // Installe avec npm install node-fetch@2
const fs = require('fs');
const path = require('path');
const { createGroups  } = require('./pairing');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;

async function getToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: params,
    });

    const data = await res.json();

    if (data.error) {
      console.error('Erreur lors de la récupération du token:', data);
      process.exit(1);
    }

    return data.access_token;
  } catch (err) {
    console.error('Erreur réseau ou inattendue:', err);
    process.exit(1);
  }
}

async function callGraph(token) {
  // Appel à Microsoft Graph : infos de l’utilisateur connecté
  // Note : avec client_credentials, /me ne marche pas (pas d’utilisateur), 
  // donc on appelle /users pour lister des utilisateurs du tenant.

  const url = 'https://graph.microsoft.com/v1.0/users?$top=1';

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Erreur Graph API:', err);
    process.exit(1);
  }

  const data = await res.json();
  //console.log('Données Microsoft Graph:', JSON.stringify(data, null, 2));
}

(async () => {
  const token = await getToken();
  //console.log('Token reçu :', token.slice(0, 30) + '...'); // aperçu
  await callGraph(token);
})();


///////////////////////////////
// 
//
// 🔹 Chargement des noms depuis un fichier local (modifiable facilement)
const noms = fs.readFileSync(path.join(__dirname, 'noms.txt'), 'utf-8')
  .split('\n')
  .map(n => n.trim())
  .filter(n => n.length > 0);

// 🔹 Création des groupes
const groupes = createGroups(noms).map((group, index) => {
  return {
    nom: `Groupe ${index + 1}`,
    membres: group
  };
});

// 🔹 Affichage console pour débogage
console.log(JSON.stringify(groupes, null, 2));

// 🔹 Sauvegarde dans un fichier pour usage ultérieur (Teams, front, etc.)
fs.writeFileSync(path.join(__dirname, 'groupes.json'), JSON.stringify(groupes, null, 2), 'utf-8');
*/
const express = require('express');
const dotenv = require('dotenv');
const generateRoute = require('./routes/generate');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use('/generate', generateRoute);

app.listen(PORT, () => {
  console.log(`CaféBonjour running at http://localhost:${PORT}`);
});