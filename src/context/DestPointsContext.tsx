import { Point } from '@/commons/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface DestPointsContextType {
  setDestPoints: (value: ((prevState: Point[]) => Point[]) | Point[]) => void;
  destPoints: Point[];
}

const DestPointsContext = createContext<DestPointsContextType | undefined>(undefined);

export const DestPointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destPoints, setDestPoints] = useState<Point[]>([]);

  const value = {
    destPoints,
    setDestPoints,
  };

  return <DestPointsContext.Provider value={value}>{children}</DestPointsContext.Provider>;
};

export const useDestPoints = () => {
  const context = useContext(DestPointsContext);
  if (!context) {
    throw new Error('useSelectedPoints must be used within a SelectedPointsProvider');
  }
  return context;
};
