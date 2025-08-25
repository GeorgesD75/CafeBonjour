export function createGroups(users) {
  const shuffled = [...users].sort(() => Math.random() - 0.5);
  const groupes = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    const groupUsers = shuffled.slice(i, i + 2);

    // Si on n’a qu’un seul utilisateur restant, on l’ajoute au dernier groupe
    if (groupUsers.length === 1 && groupes.length > 0) {
      groupes[groupes.length - 1].users.push(groupUsers[0]);
    } else {
      groupes.push({ nom: `Groupe ${groupes.length + 1}`, users: groupUsers });
    }
  }

  return groupes.map(group => {
    const [user1, user2, user3] = group.users;
    return {
      nom: group.nom,
      user1: user1 || null,
      user2: user2 || null,
      user3: user3 || null
    };
  });
}
