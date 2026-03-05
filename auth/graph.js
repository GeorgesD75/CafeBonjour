// auth/graph.js
import axios from 'axios';

export async function getAllUsers(accessToken) {
  let allUsers = [];
  // Filtre: Uniquement les comptes ACTIFS et les employés (exclut les Guests/Prestataires)
  let url = "https://graph.microsoft.com/v1.0/users?$filter=accountEnabled eq true and userType eq 'Member'&$select=id,displayName,mail";

  try {
    while (url) {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ConsistencyLevel: 'eventual' // Requis par Microsoft pour les filtres avancés
        }
      });

      const chunk = response.data.value.map(user => ({
        id: user.id,
        displayName: user.displayName,
        mail: user.mail
      }));

      allUsers = allUsers.concat(chunk);

      // Gestion de la pagination (Graph API limite à 100 ou 999 résultats par page)
      url = response.data['@odata.nextLink'];
    }

    return allUsers;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs via Graph :', error.response?.data || error);
    throw error;
  }
}
