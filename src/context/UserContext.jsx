import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { registerUser, loginFind, updateUserInList, deleteUserFromList } from '../utils/userContext.logic';
import { readUsers, writeUsers, readCurrentRun, writeCurrentRun } from '../data/db';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => readUsers());
  const [currentRun, setCurrentRun] = useState(() => readCurrentRun());

  const currentUser = useMemo(() => users.find(u => u.run === currentRun) || null, [users, currentRun]);

  useEffect(() => { writeUsers(users); }, [users]);
  useEffect(() => { writeCurrentRun(currentRun); }, [currentRun]);

  const register = useCallback((user, password, role = 'client') => {
    const newList = registerUser(users, user, password, role);
    setUsers(newList);
    return newList.find(u => u.run === user.run);
  }, [users]);

  const login = useCallback((identifier, password) => {
    const u = loginFind(users, identifier, password);
    setCurrentRun(u.run);
    return u;
  }, [users]);

  const logout = useCallback(() => setCurrentRun(null), []);

  const updateUser = useCallback((run, patch) => {
    setUsers(prev => updateUserInList(prev, run, patch));
  }, []);

  const deleteUser = useCallback((run) => {
    setUsers(prev => deleteUserFromList(prev, run));
    setCurrentRun(cr => (cr === run ? null : cr));
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
