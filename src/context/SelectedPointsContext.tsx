import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Point } from '@/commons/types';

interface SelectedPointsContextType {
  selectedPoints: Point[];
  setSelectedPoints: (points: (prev) => any[]) => void;
}

const SelectedPointsContext = createContext<SelectedPointsContextType | undefined>(undefined);

export const SelectedPointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);

  const value = {
    selectedPoints,
    setSelectedPoints,
  };

  return <SelectedPointsContext.Provider value={value}>{children}</SelectedPointsContext.Provider>;
};

export const useSelectedPoints = () => {
  const context = useContext(SelectedPointsContext);
  if (!context) {
    throw new Error('useSelectedPoints must be used within a SelectedPointsProvider');
  }
  return context;
};
