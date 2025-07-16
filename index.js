// index.js - Script de pairing pour GitHub Actions UNIQUEMENT
// ⚠️ NE PAS IMPORTER DE ROUTES EXPRESS ICI !
import { getUsersFromTeams } from './scripts/pairing-from-graph.js';
import { createGroups } from './scripts/pairing.js';

async function main() {
  try {
    console.log('🔄 Récupération des utilisateurs depuis Microsoft Graph...');
    const users = await getUsersFromTeams();
    
    if (!users || users.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`✅ ${users.length} utilisateurs trouvés`);
    
    const groupes = createGroups(users);
    
    console.log('\n📅 Groupes de pairing du jour :');
    groupes.forEach((groupe) => {
      console.log(`\n${groupe.nom}:`);
      console.log(`  👤 ${groupe.user1}`);
      console.log(`  👤 ${groupe.user2}`);
      if (groupe.user3) {
        console.log(`  👤 ${groupe.user3}`);
      }
    });
    
    console.log(`\n🎉 ${groupes.length} groupes créés avec succès !`);
    console.log('☕ Bon café à tous !');
    
  } catch (error) {
    console.error('❌ Erreur lors du pairing :', error.message);
    process.exit(1);
  }
}

// Lancer le script
main();