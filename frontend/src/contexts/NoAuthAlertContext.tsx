"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import NoAuthAlert from '@/components/alerts/NoAuthAlert';

interface NoAuthAlertContextType {
  showAlert: (action?: string) => void;
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
  const [action, setAction] = useState<string | undefined>(undefined);

  const showAlert = (actionName?: string) => {
    setAction(actionName);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
  };

  return (
    <NoAuthAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <NoAuthAlert isOpen={isOpen} onClose={hideAlert} action={action} />
    </NoAuthAlertContext.Provider>
  );
};
