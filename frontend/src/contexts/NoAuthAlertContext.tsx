"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import NoAuthAlert from '@/components/alerts/NoAuthAlert';
import ClosedSession from '@/components/alerts/ClosedSession';

interface NoAuthAlertContextType {
  showAlert: (action?: string) => void;
  showSessionAlert: () => void;
  hideAlert: () => void;
}


const NoAuthAlertContext = createContext<NoAuthAlertContextType | undefined>(undefined);

export const useNoAuthAlert = () => {
  const context = useContext(NoAuthAlertContext);
  if (!context) {
    throw new Error('useNoAuthAlert debe usarse dentro de NoAuthAlertProvider');
  }
  return context;
};

export const NoAuthAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSessionAlertOpen, setIsSessionAlertOpen] = useState(false);
  const [action, setAction] = useState<string | undefined>(undefined);

  // Escuchar evento de logout automático (ej: por token expirado)
  useEffect(() => {
    const handleAutoLogout = () => {
      showSessionAlert();
    };

    window.addEventListener('auth-logout', handleAutoLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAutoLogout);
    };
  }, []);

  const showAlert = (actionName?: string) => {

    setAction(actionName);
    setIsOpen(true);
  };

  const showSessionAlert = () => {
    setIsSessionAlertOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
    setIsSessionAlertOpen(false);
  };

  return (
    <NoAuthAlertContext.Provider value={{ showAlert, showSessionAlert, hideAlert }}>
      {children}
      <NoAuthAlert isOpen={isOpen} onClose={hideAlert} action={action} />
      <ClosedSession isOpen={isSessionAlertOpen} onClose={hideAlert} />
    </NoAuthAlertContext.Provider>
  );
};

