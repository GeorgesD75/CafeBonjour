import cron from 'node-cron';
import { getSettings, getAllTenants } from './db.js';
import { createGroups } from './pairing.js';
import { getAllUsers } from '../auth/graph.js';
import { getAccessToken } from '../auth/msalConfig.js';
import { sendMessages } from './sendMessages.js';

let activeCronJobs = {}; // Stocke les tâches par tenantId

// Conversion du jour choisi ("monday", "tuesday"...) en index cron (1-5)
const daysMap = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5
};

export async function schedulePairingJob() {
    const tenants = await getAllTenants();

    // Arrêter toutes les tâches cron existantes avant de les recréer
    Object.values(activeCronJobs).forEach(job => job.stop());
    activeCronJobs = {};
    console.log(`🔄 Tâches cron arrêtées. Reprogrammation pour ${tenants.length} locataire(s)...`);

    for (const tenantId of tenants) {
        const settings = await getSettings(tenantId);
        const { selectedDay, time, timezone } = settings;

        const dayNumber = daysMap[selectedDay] || 1;
        const [hours, minutes] = time.split(':');

        // Récupération de la Timezone renseignée par l'Admin (Sinon Paris par défaut)
        const tz = timezone || "Europe/Paris";

        // Format Cron : "minutes heures * * jour_de_la_semaine"
        const cronExpression = `${minutes} ${hours} * * ${dayNumber}`;

        console.log(`⏰ [Locataire: ${tenantId}] - Prochaine génération : ${selectedDay} à ${time} (Timezone: ${tz}) (Cron: ${cronExpression})`);

        const job = cron.schedule(cronExpression, async () => {
            console.log(`☕ [Locataire: ${tenantId}] Démarrage automatique de la génération Café Bonjour...`);
            try {
                // Acquisition du token d'application pure spécifique au locataire
                const accessToken = await getAccessToken(tenantId);

                const users = await getAllUsers(accessToken);
                if (!users || users.length === 0) {
                    console.log(`❌ [Locataire: ${tenantId}] Aucun utilisateur trouvé.`);
                    return;
                }

                const groupes = createGroups(users);
                await sendMessages(groupes, accessToken, settings);

                console.log(`✅ [Locataire: ${tenantId}] Génération réussie (${groupes.length} groupes)`);

            } catch (error) {
                console.error(`❌ [Locataire: ${tenantId}] Erreur lors du job automatisé :`, error);
            }
        }, {
            scheduled: true,
            timezone: tz
        });

        activeCronJobs[tenantId] = job;
    }
}
