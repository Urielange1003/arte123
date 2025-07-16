import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchApi } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  authToken: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoadingAuth: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setAuthToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          await checkAuthStatus(storedToken);
        } catch (e) {
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setAuthToken(null);
        setUser(null);
        setIsLoadingAuth(false);
      }
    };
    initializeAuth();
    // eslint-disable-next-line
  }, []);

  const checkAuthStatus = async (tokenToCheck: string | null = authToken) => {
    if (!tokenToCheck) {
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
      setIsLoadingAuth(false);
      return;
    }
    setIsLoadingAuth(true);
    try {
      const response = await fetchApi<User>('user', { method: 'GET' });
      if (response && response.id) {
        setIsAuthenticated(true);
        setAuthToken(tokenToCheck);
        setUser(response);
        localStorage.setItem('user', JSON.stringify(response));
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthenticated(true);
    setAuthToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setAuthToken(null);
    setUser(null);
    // Optionnel : window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authToken, login, logout, isLoadingAuth, checkAuth: checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};