import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const UserContext = createContext(null);

const USERS_KEY = 'users_v1';
const CURRENT_KEY = 'current_user_run_v1';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const existing = loadUsers();
    const hasAdmin = existing.some(u => u.run === 'admin123');
    if (!hasAdmin) {
      existing.push({
        run: 'admin123',
        nombre: 'Admin',
        apellidos: 'General',
        correo: 'admin@local',
        role: 'admin',
        password: 'admin123',
        region: '',
        comuna: '',
        direccion: ''
      });
    }
    return existing;
  });
  const [currentRun, setCurrentRun] = useState(() => localStorage.getItem(CURRENT_KEY) || null);

  const currentUser = useMemo(() => users.find(u => u.run === currentRun) || null, [users, currentRun]);

  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => {
    if (currentRun) localStorage.setItem(CURRENT_KEY, currentRun); else localStorage.removeItem(CURRENT_KEY);
  }, [currentRun]);

  const register = (user, password, role = 'client') => {
    // user: { run, nombre, apellidos, correo, fechaNacimiento?, region, comuna, direccion }
    if (users.some(u => u.run === user.run)) {
      throw new Error('Ya existe un usuario con ese RUN');
    }
    const toSave = { ...user, role, password }; // Nota: demo. No usar texto plano en producción.
    setUsers(prev => [...prev, toSave]);
    return toSave;
  };

  const login = (identifier, password) => {
    const id = (identifier || '').trim();
    const u = users.find(u => u.run === id || u.correo.toLowerCase() === id.toLowerCase());
    if (!u) throw new Error('Usuario no encontrado');
    if (u.password !== password) throw new Error('Contraseña incorrecta');
    setCurrentRun(u.run);
    return u;
  };

  const logout = () => setCurrentRun(null);

  const updateUser = (run, patch) => {
    setUsers(prev => prev.map(u => u.run === run ? { ...u, ...patch, run: u.run } : u));
  };

  const deleteUser = (run) => {
    setUsers(prev => prev.filter(u => u.run !== run));
    // clear current if deleting self
    setCurrentRun(cr => (cr === run ? null : cr));
  };

  const value = useMemo(() => ({ users, currentUser, register, login, logout, updateUser, deleteUser }), [users, currentUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export default UserContext;
