import { JsonDB, Config } from 'node-json-db';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser la base de données JSON dans le dossier courant (Mode Local Fallback)
const dbPath = path.join(__dirname, 'cafebonjour_db');
const localDb = new JsonDB(new Config(dbPath, true, false, '/'));

// Instance MongoDB
let mongoClient = null;
let mongoCollection = null;

async function getMongoCollection() {
    if (!process.env.MONGODB_URI) return null;

    if (!mongoClient) {
        mongoClient = new MongoClient(process.env.MONGODB_URI);
        await mongoClient.connect();
        const db = mongoClient.db('cafebonjour');
        mongoCollection = db.collection('settings');
        console.log("🍃 Connecté à MongoDB Cloud (Atlas) !");
    }
    return mongoCollection;
}

export async function saveSettings(tenantId, settings) {
    if (!tenantId) throw new Error("tenantId est requis");

    const collection = await getMongoCollection();
    if (collection) {
        // Mode Production Cloud (MongoDB)
        await collection.updateOne(
            { tenantId },
            { $set: { settings } },
            { upsert: true }
        );
    } else {
        // Mode Développement (Fichier Local)
        await localDb.push(`/tenants/${tenantId}/settings`, settings);
    }
}

export async function getSettings(tenantId) {
    if (!tenantId) throw new Error("tenantId est requis");

    const defaultSettings = {
        selectedDay: 'monday',
        time: '09:00',
        channelName: ' café-bonjour',
        message: "Bonjour {groupe} 👋\nProfitez de cette conversation pour planifier un moment sympa autour d'un café dans la semaine !"
    };

    try {
        const collection = await getMongoCollection();
        if (collection) {
            // Mode Production Cloud
            const doc = await collection.findOne({ tenantId });
            return doc?.settings || defaultSettings;
        } else {
            // Mode Local
            return await localDb.getData(`/tenants/${tenantId}/settings`);
        }
    } catch (error) {
        return defaultSettings;
    }
}

export async function getAllTenants() {
    try {
        const collection = await getMongoCollection();
        if (collection) {
            // Mode Production Cloud
            const docs = await collection.find({}, { projection: { tenantId: 1 } }).toArray();
            return docs.map(d => d.tenantId);
        } else {
            // Mode Local
            const tenantsData = await localDb.getData('/tenants');
            return Object.keys(tenantsData);
        }
    } catch (error) {
        return [];
    }
}
