// index.js
import { getUsersFromTeams } from './scripts/pairing-from-graph.js';
import { createGroups } from './scripts/pairing.js';

async function main() {
  try {
    console.log('🔄 Récupération des utilisateurs...');
    const users = await getUsersFromTeams();
    
    console.log(`✅ ${users.length} utilisateurs trouvés`);
    
    const groupes = createGroups(users);
    
    console.log('\n📅 Groupes du jour :');
    groupes.forEach((g, i) => {
      console.log(`\n${g.nom}:`);
      console.log(`- ${g.user1}`);
      console.log(`- ${g.user2}`);
      if (g.user3) console.log(`- ${g.user3}`);
    });
    
    console.log('\n🎉 Pairing terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du pairing :', error);
    process.exit(1);
  }
}

main();