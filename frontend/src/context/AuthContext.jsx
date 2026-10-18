import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sem_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      localStorage.setItem('sem_token', result.token);
      localStorage.setItem('sem_user', JSON.stringify(result.user));
      setUser(result.user);
      return result.user;
    } finally { setLoading(false); }
  };
  const register = async (details) => {
    setLoading(true);
    try {
      const result = await authService.register(details);
      localStorage.setItem('sem_token', result.token);
      localStorage.setItem('sem_user', JSON.stringify(result.user));
      setUser(result.user);
      return result.user;
    } finally { setLoading(false); }
  };
  const logout = () => {
    localStorage.removeItem('sem_token'); localStorage.removeItem('sem_user'); setUser(null);
  };
  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN' }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuthContext must be used inside AuthProvider');
  return value;
}
export default AuthContext;
