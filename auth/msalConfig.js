// auth/msalConfig.js
import 'dotenv/config';
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

/**
 * Récupère un token d'application pour MS Graph
 */
export async function getAccessToken() {
  try {
    const result = await cca.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });
    return result.accessToken;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du token MSAL :', error);
    throw error;
  }
}

export default cca;
