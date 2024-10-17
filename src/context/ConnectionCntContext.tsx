import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ConnectionCntContextType {
  activeConnections: number;
  setActiveConnections: (value: ((prevState: number) => number) | number) => void;
}

const ConnectionCntContext = createContext<ConnectionCntContextType | undefined>(undefined);

export const ConnectionCountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeConnections, setActiveConnections] = useState<number>(0);

  const value = {
    activeConnections,
    setActiveConnections,
  };

  return <ConnectionCntContext.Provider value={value}>{children}</ConnectionCntContext.Provider>;
};

export const useConnectionCnt = () => {
  const context = useContext(ConnectionCntContext);
  if (!context) {
    throw new Error('useSelectedPoints must be used within a SelectedPointsProvider');
  }
  return context;
};
