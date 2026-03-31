"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser, ILoginUser, IRegisterUser } from '@/types/User';
import { apiClient } from '@/config/api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: ILoginUser) => Promise<void>;
  register: (userData: IRegisterUser) => Promise<void>;
  setAuthFromExternal: (user: IUser, accessToken: string) => void;
  updateUser: (user: IUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar usuario y token del localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  // Escuchar evento de logout automático (ej: por token expirado)
  useEffect(() => {
    const handleAutoLogout = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleAutoLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAutoLogout);
    };
  }, []);

  const login = async (credentials: ILoginUser) => {
    try {
      const response = await apiClient.post<{ success: boolean; data: { user: IUser; accessToken: string } }>('/users/login', credentials);

      // El backend ahora retorna { success: true, data: { user, accessToken } }
      const { user, accessToken } = response.data.data;

      setToken(accessToken);
      setUser(user);

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: IRegisterUser) => {
    try {
      const response = await apiClient.post<{ success: boolean; data: IUser; message: string }>('/users/register', userData);

      // El backend ahora retorna { success: true, message: "...", data: usuario }
      const newUser = response.data.data;
      setUser(newUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const setAuthFromExternal = (externalUser: IUser, accessToken: string) => {
    setToken(accessToken);
    setUser(externalUser);

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(externalUser));
    }
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    setAuthFromExternal,
    updateUser,
    logout,
    isAuthenticated: !!token && !!user,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

