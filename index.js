// index.js
import { getUsersFromTeams } from './scripts/pairing-from-graph.js';
import { createGroups } from './scripts/pairing.js';

async function main() {
  const users = await getUsersFromTeams();
  const groupes = createGroups(users);

  console.log('📅 Groupes du jour :');
  groupes.forEach((g, i) => {
    console.log(`\n${g.nom}:`);
    console.log(`- ${g.user1}`);
    console.log(`- ${g.user2}`);
    if (g.user3) console.log(`- ${g.user3}`);
  });
}

main();
