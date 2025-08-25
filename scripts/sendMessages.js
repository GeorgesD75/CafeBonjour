import axios from "axios";

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

export async function sendMessages(groups, accessToken) {
  for (const group of groups) {
    const users = [group.user1, group.user2, group.user3].filter(Boolean);
    if (users.length < 2) continue;

    try {
      const chatId = await createOrReuseChat(users, accessToken);
      await sendChatMessage(chatId, buildIntroMessage(), accessToken);
      console.log(`✅ Message envoyé au groupe avec chatId ${chatId}`);
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message : ", error?.response?.data || error.message);
    }
  }
}

// Crée ou réutilise un chat nommé "CaféBonjour" avec ces membres
async function createOrReuseChat(users, accessToken) {
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
    topic: "CaféBonjour",
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

// Contenu du message de bienvenue
function buildIntroMessage() {
  return `
Bonjour à tous ! 👋

Bienvenue dans votre conversation *CaféBonjour* de la semaine !

Lancez la discussion, proposez un créneau, et profitez de ce moment pour mieux vous connaître.  

Excellente semaine à vous tous ! 🌟
  `;
}
