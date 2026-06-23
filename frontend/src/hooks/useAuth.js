import { useState, useCallback } from 'react';

// Token stored in memory only — prevents XSS token theft
let _token = null;

const useAuth = () => {
  const [user, setUser] = useState(null);
  const login = useCallback((token, userData) => { _token = token; setUser(userData); }, []);
  const logout = useCallback(() => { _token = null; setUser(null); }, []);
  const getToken = useCallback(() => _token, []);
  return { user, login, logout, getToken, isAuthenticated: !!user };
};

export default useAuth;
