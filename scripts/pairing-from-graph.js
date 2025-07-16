import 'dotenv/config';
import fetch from 'node-fetch';

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
      console.error('❌ Erreur de token :', data.error_description || data.error);
      process.exit(1);
    }

    return data.access_token;
  } catch (err) {
    console.error('❌ Erreur réseau OAuth :', err);
    process.exit(1);
  }
}

async function getUsers(token) {
  const url = 'https://graph.microsoft.com/v1.0/users?$select=displayName&$top=999';

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('❌ Erreur Graph API :', err);
    process.exit(1);
  }

  const data = await res.json();

  const users = data.value
    .map(user => user.displayName?.trim())
    .filter(Boolean);

  return users;
}

export async function getUsersFromTeams() {
  const token = await getToken();
  const users = await getUsers(token);
  return users;
}
