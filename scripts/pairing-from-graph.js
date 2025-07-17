import 'dotenv/config';
import fetch from 'node-fetch';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;

async function getToken() {
  // Vérifier les variables d'environnement
  if (!clientId || !clientSecret || !tenantId) {
    console.error('❌ Variables d\'environnement manquantes:');
    console.error('- CLIENT_ID:', clientId ? '✅ Défini' : '❌ Manquant');
    console.error('- CLIENT_SECRET:', clientSecret ? '✅ Défini' : '❌ Manquant');
    console.error('- TENANT_ID:', tenantId ? '✅ Défini' : '❌ Manquant');
    process.exit(1);
  }

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  try {
    console.log('🔑 Demande de token OAuth...');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    console.log('📡 Statut de la réponse:', res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Erreur HTTP:', res.status, res.statusText);
      console.error('❌ Contenu de l\'erreur:', errorText);
      process.exit(1);
    }

    const responseText = await res.text();
    
    if (!responseText || responseText.trim() === '') {
      console.error('❌ Réponse vide de l\'API OAuth');
      process.exit(1);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON:', parseError.message);
      console.error('❌ Contenu de la réponse:', responseText);
      process.exit(1);
    }

    if (data.error) {
      console.error('❌ Erreur OAuth:', data.error_description || data.error);
      process.exit(1);
    }

    if (!data.access_token) {
      console.error('❌ Token manquant dans la réponse');
      console.error('❌ Contenu de la réponse:', data);
      process.exit(1);
    }

    console.log('✅ Token OAuth obtenu avec succès');
    return data.access_token;

  } catch (err) {
    console.error('❌ Erreur réseau OAuth:', err.message);
    console.error('❌ Stack:', err.stack);
    process.exit(1);
  }
}

async function getUsers(token) {
  const url = 'https://graph.microsoft.com/v1.0/users?$select=displayName&$top=999';

  try {
    console.log('👥 Récupération des utilisateurs...');
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('❌ Erreur Graph API:', res.status, res.statusText);
      console.error('❌ Détails:', err);
      process.exit(1);
    }

    const data = await res.json();

    const users = data.value
      .map(user => user.displayName?.trim())
      .filter(Boolean);

    console.log(`✅ ${users.length} utilisateurs trouvés`);
    return users;

  } catch (err) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', err.message);
    process.exit(1);
  }
}

export async function getUsersFromTeams() {
  const token = await getToken();
  const users = await getUsers(token);
  return users;
}
