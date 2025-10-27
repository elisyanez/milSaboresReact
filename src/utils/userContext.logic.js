export function ensureAdminSeed(list) {
  const users = Array.from(list || []);
  const hasAdmin = users.some((u) => u.run === 'admin123');
  if (!hasAdmin) {
    users.push({
      run: 'admin123',
      nombre: 'Admin',
      apellidos: 'General',
      correo: 'admin@local',
      role: 'admin',
      password: 'admin123',
      region: '',
      comuna: '',
      direccion: '',
    });
  }
  return users;
}

export function registerUser(list, user, password, role = 'client') {
  const users = Array.from(list || []);
  if (users.some((u) => u.run === user.run)) {
    throw new Error('Ya existe un usuario con ese RUN');
  }
  const toSave = { ...user, role, password };
  return [...users, toSave];
}

export function loginFind(users, identifier, password) {
  const id = (identifier || '').trim();
  const u = (users || []).find((u) => u.run === id || (u.correo || '').toLowerCase() === id.toLowerCase());
  if (!u) throw new Error('Usuario no encontrado');
  if (u.password !== password) throw new Error('Contraseña incorrecta');
  return u;
}

export function updateUserInList(users, run, patch) {
  return (users || []).map((u) => (u.run === run ? { ...u, ...patch, run: u.run } : u));
}

export function deleteUserFromList(users, run) {
  return (users || []).filter((u) => u.run !== run);
}

