import { JsonDB, Config } from 'node-json-db';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser la base de données JSON dans le dossier courant
const dbPath = path.join(__dirname, 'cafebonjour_db');
const db = new JsonDB(new Config(dbPath, true, false, '/'));

export async function saveSettings(tenantId, settings) {
    if (!tenantId) throw new Error("tenantId est requis");
    // On sauvegarde sous le chemin /tenants/{tenantId}/settings
    await db.push(`/tenants/${tenantId}/settings`, settings);
}

export async function getSettings(tenantId) {
    if (!tenantId) throw new Error("tenantId est requis");
    try {
        return await db.getData(`/tenants/${tenantId}/settings`);
    } catch (error) {
        // Retourne la configuration par défaut si rien n'est sauvegardé pour ce locataire
        return {
            selectedDay: 'monday',
            time: '09:00',
            channelName: '☕ café-bonjour',
            message: 'Bonjour {groupe} 👋\nBienvenue à votre café du jour dans #{canal} ☕'
        };
    }
}

export async function getAllTenants() {
    try {
        const tenantsData = await db.getData('/tenants');
        return Object.keys(tenantsData); // Retourne un tableau des IDs ["tenant_A", "tenant_B"]
    } catch (error) {
        return []; // Aucun locataire configuré
    }
}
