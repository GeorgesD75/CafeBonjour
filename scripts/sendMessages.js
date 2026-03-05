import axios from "axios";

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function sendMessages(groups, accessToken, settings) {
  for (const group of groups) {
    const users = [group.user1, group.user2, group.user3].filter(Boolean);
    if (users.length < 2) continue;

    let success = false;
    let attempts = 0;

    while (!success && attempts < 3) {
      attempts++;
      try {
        // 1. Définition du nom ou sujet du Chat
        const chatTopic = settings.channelName || "café-bonjour☕";

        // 2. Création de la conversation privée de groupe
        const chatId = await createOrReuseChat(users, accessToken, chatTopic);

        // 3. Remplacement du tag {groupe} par le nom des employés
        const groupNames = users.map(u => u.displayName || 'Collègue').join(', ');
        const rawMessage = settings.message || 'Bonjour {groupe} 👋\nProfitez de ce moment !';
        const finalMessage = rawMessage.replaceAll('{groupe}', groupNames);

        // 4. Envoi du message automatique
        await sendChatMessage(chatId, finalMessage, accessToken);
        console.log(`✅ Message envoyé au groupe avec chatId ${chatId}`);
        success = true;

        // Limite nominale Teams : ~4 requêtes par seconde. On attend 250ms max.
        await delay(250);

      } catch (error) {
        if (error.response && error.response.status === 429) {
          // INTERCEPTION DU RATE-LIMITING MICROSOFT
          const retryAfter = error.response.headers['retry-after'] || 5;
          console.warn(`⚠️ Rate limit atteint. Pause dynamique de ${retryAfter} secondes...`);
          await delay(retryAfter * 1000);
        } else {
          console.error("❌ Erreur lors de l'envoi du message : ", error?.response?.data || error.message);
          break; // Si ce n'est pas une erreur 429, on abandonne ce groupe et on passe au suivant
        }
      }
    }
  }
}

// Crée ou réutilise un chat nommé avec ces membres
async function createOrReuseChat(users, accessToken, chatTopic) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const memberPayload = users.map((user) => ({
    "@odata.type": "#microsoft.graph.aadUserConversationMember",
    roles: ["owner"],
    "user@odata.bind": `${GRAPH_BASE_URL}/users/${user.id}`,
  }));

  const chatPayload = {
    chatType: "group",
    topic: chatTopic || "CaféBonjour",
    members: memberPayload,
  };

  const response = await axios.post(`${GRAPH_BASE_URL}/chats`, chatPayload, { headers });
  return response.data.id;
}

// Envoie le message d’introduction au chat
async function sendChatMessage(chatId, message, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const messagePayload = {
    body: {
      content: message,
    },
  };

  await axios.post(`${GRAPH_BASE_URL}/chats/${chatId}/messages`, messagePayload, { headers });
}
