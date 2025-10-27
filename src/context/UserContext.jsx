import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ensureAdminSeed, registerUser, loginFind, updateUserInList, deleteUserFromList } from '../utils/userContext.logic';

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
  const [users, setUsers] = useState(() => ensureAdminSeed(loadUsers()))
  const [currentRun, setCurrentRun] = useState(() => localStorage.getItem(CURRENT_KEY) || null);

  const currentUser = useMemo(() => users.find(u => u.run === currentRun) || null, [users, currentRun]);

  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => {
    if (currentRun) localStorage.setItem(CURRENT_KEY, currentRun); else localStorage.removeItem(CURRENT_KEY);
  }, [currentRun]);

  const register = (user, password, role = 'client') => {
    const newList = registerUser(users, user, password, role);
    setUsers(newList);
    return newList.find(u => u.run === user.run);
  };

  const login = (identifier, password) => {
    const u = loginFind(users, identifier, password);
    setCurrentRun(u.run);
    return u;
  };

  const logout = () => setCurrentRun(null);

  const updateUser = (run, patch) => {
    setUsers(prev => updateUserInList(prev, run, patch));
  };

  const deleteUser = (run) => {
    setUsers(prev => deleteUserFromList(prev, run));
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

