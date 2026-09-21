'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Outlet } from '@uttara/shared';
import { fetchApi } from '../lib/api';

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  favoriteOutletId?: string | null;
  loyaltyPoints?: number;
  loyaltyTier?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  selectedOutlet: Outlet | null;
  setSelectedOutlet: (outlet: Outlet | null) => void;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and default outlet on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('uttara_access_token');
    const savedOutlet = localStorage.getItem('uttara_selected_outlet');

    if (savedOutlet) {
      try {
        setSelectedOutlet(JSON.parse(savedOutlet));
      } catch (e) {
        // ignore
      }
    } else {
      // Default to first active outlet
      fetchApi<{ outlets: Outlet[] }>('/api/outlets')
        .then((res) => {
          if (res.outlets && res.outlets.length > 0) {
            setSelectedOutlet(res.outlets[0]);
            localStorage.setItem('uttara_selected_outlet', JSON.stringify(res.outlets[0]));
          }
        })
        .catch(() => {});
    }

    if (savedToken) {
      setToken(savedToken);
      fetchApi<{ user: AuthUser }>('/api/auth/me', {}, savedToken)
        .then((res) => {
          setUser(res.user);
        })
        .catch(() => {
          localStorage.removeItem('uttara_access_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSetSelectedOutlet = (outlet: Outlet | null) => {
    setSelectedOutlet(outlet);
    if (outlet) {
      localStorage.setItem('uttara_selected_outlet', JSON.stringify(outlet));
    } else {
      localStorage.removeItem('uttara_selected_outlet');
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    const res = await fetchApi<{ user: AuthUser; tokens: { accessToken: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone, password }),
    });

    setUser(res.user);
    setToken(res.tokens.accessToken);
    localStorage.setItem('uttara_access_token', res.tokens.accessToken);
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await fetchApi<{ user: AuthUser; tokens: { accessToken: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });

    setUser(res.user);
    setToken(res.tokens.accessToken);
    localStorage.setItem('uttara_access_token', res.tokens.accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('uttara_access_token');
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await fetchApi<{ user: AuthUser }>('/api/auth/me', {}, token);
      setUser(res.user);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        selectedOutlet,
        setSelectedOutlet: handleSetSelectedOutlet,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
