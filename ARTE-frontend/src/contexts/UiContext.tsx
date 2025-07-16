import React, { createContext, useState, ReactNode } from 'react';

interface UIContextType {
  isLoading: boolean;
  errorMessage: string | null;
  setLoading: (loading: boolean) => void;
  setError: (message: string) => void;
  clearError: () => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setError = (message: string) => {
    setErrorMessage(message);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  return (
    <UIContext.Provider value={{ isLoading, errorMessage, setLoading, setError, clearError }}>
      {children}
    </UIContext.Provider>
  );
};
