// auth/msalConfig.js
import * as msal from '@azure/msal-node';
import dotenv from 'dotenv';
dotenv.config();

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID || 'common'}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        // console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    }
  }
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

export async function getAccessToken(tenantId = process.env.TENANT_ID || 'common') {
  const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
    authority: `https://login.microsoftonline.com/${tenantId}`
  };
  try {
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    return response.accessToken;
  } catch (error) {
    console.error("Erreur d'acquisition de token d'application :", error);
    throw error;
  }
}

export default cca;
