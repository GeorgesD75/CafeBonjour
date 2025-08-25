// auth/graph.js
import axios from 'axios';

/**
 * Récupère tous les utilisateurs du tenant via Microsoft Graph
 * @param {string} accessToken - Jeton d'accès Microsoft Graph
 * @returns {Array} Liste des utilisateurs simplifiés
 */
export async function getAllUsers(accessToken) {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data.value.map(user => ({
      id: user.id,
      displayName: user.displayName,
      mail: user.mail
    }));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs via Graph :', error.response?.data || error);
    throw error;
  }
}
