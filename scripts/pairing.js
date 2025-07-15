export function createGroups(logins) {
  const shuffled = [...logins].sort(() => Math.random() - 0.5);
  const groups = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    const user1 = shuffled[i];
    const user2 = shuffled[i + 1];

    // Si on est à la fin et qu’il reste 1 seul
    if (i + 1 === shuffled.length - 1) {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && !lastGroup.user3) {
        lastGroup.user3 = user2;
      } else {
        groups.push({
          nom: `Groupe ${groups.length + 1}`,
          user1,
          user2,
          user3: '',
        });
      }
      break;
    }

    groups.push({
      nom: `Groupe ${groups.length + 1}`,
      user1,
      user2,
      user3: '',
    });
  }

  return groups;
}