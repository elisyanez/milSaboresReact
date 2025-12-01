import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { updateUserInList, deleteUserFromList } from '../utils/userContext.logic';

const API_BASE = 'http://localhost:8080';
const AUTH_URL = `${API_BASE}/api/auth`;
const USERS_URL = `${API_BASE}/api/usuarios`;

axios.defaults.withCredentials = true;

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const normalizeUser = useCallback((raw) => {
    const u = raw?.usuario || raw;
    if (!u) return null;
    const { run, nombre, apellidos, correo, role, region, comuna, direccion, password } = u;
    return { run, nombre, apellidos, correo, role, region, comuna, direccion, password };
  }, []);

  const upsertUser = useCallback((list, user) => {
    const arr = Array.from(list || []);
    const idx = arr.findIndex(u => u.run === user.run);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...user };
    } else {
      arr.push(user);
    }
    return arr;
  }, []);

  const loadUsers = useCallback(async () => {
    const res = await axios.get(USERS_URL, { withCredentials: true });
    const fetched = Array.isArray(res.data) ? res.data.map(normalizeUser).filter(Boolean) : [];
    setUsers(fetched);
  }, [normalizeUser]);

  const fetchCurrentFromSession = useCallback(async () => {
    try {
      const res = await axios.get(`${AUTH_URL}/me`, { withCredentials: true });
      const u = normalizeUser(res.data);
      if (u) {
        setCurrentUser(u);
        setUsers(prev => upsertUser(prev, u));
      }
    } catch (_err) {
      // Silently ignore if endpoint does not exist or user is not logged in
    }
  }, [normalizeUser, upsertUser]);

  useEffect(() => {
    loadUsers();
    fetchCurrentFromSession();
  }, [loadUsers, fetchCurrentFromSession]);

  const register = useCallback(async (user, password, role = 'client') => {
    const payload = { ...user, password, role };
    const res = await axios.post(`${AUTH_URL}/register`, payload, { withCredentials: true });
    const created = normalizeUser(res.data);
    if (created) {
      setUsers(prev => upsertUser(prev, created));
    }
    return created;
  }, [normalizeUser, upsertUser]);

  const login = useCallback(async (identifier, password) => {
    const payload = identifier?.includes('@')
      ? { correo: identifier, password }
      : { run: identifier, password };
    const res = await axios.post(`${AUTH_URL}/login`, payload, { withCredentials: true });
    const u = normalizeUser(res.data);
    if (!u) throw new Error('Respuesta de login invalida');
    setCurrentUser(u);
    setUsers(prev => upsertUser(prev, u));
    return u;
  }, [normalizeUser, upsertUser]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const updateUser = useCallback(async (run, patch) => {
    const res = await axios.put(`${USERS_URL}/${run}`, patch, { withCredentials: true });
    const updated = normalizeUser(res.data) || { ...patch, run };
    setUsers(prev => updateUserInList(prev, run, updated));
    if (currentUser?.run === run) setCurrentUser(prev => ({ ...prev, ...updated }));
    return updated;
  }, [currentUser, normalizeUser]);

  const deleteUser = useCallback(async (run) => {
    await axios.delete(`${USERS_URL}/${run}`, { withCredentials: true });
    setUsers(prev => deleteUserFromList(prev, run));
    setCurrentUser(cr => (cr?.run === run ? null : cr));
  }, []);

  const value = useMemo(
    () => ({ users, currentUser, register, login, logout, updateUser, deleteUser }),
    [users, currentUser, register, login, logout, updateUser, deleteUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export default UserContext;
