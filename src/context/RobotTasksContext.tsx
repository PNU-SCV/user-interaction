import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Point } from '@/commons/types';

interface RobotTasksContextType {
  robotTasks: { [key: string]: [Point[]] };
  setRobotTasks: (
    value:
      | ((prevState: { [p: string]: [Point[]] }) => { [p: string]: [Point[]] })
      | { [p: string]: [Point[]] },
  ) => void;
}

const RobotTasksContext = createContext<RobotTasksContextType | undefined>(undefined);

export const RobotTasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [robotTasks, setRobotTasks] = useState<{ [key: string]: [Point[]] }>({});

  const value = {
    robotTasks: robotTasks,
    setRobotTasks: setRobotTasks,
  };

  return <RobotTasksContext.Provider value={value}>{children}</RobotTasksContext.Provider>;
};

export const useRobotTasks = () => {
  const context = useContext(RobotTasksContext);
  if (!context) {
    throw new Error('useSelectedPoints must be used within a SelectedPointsProvider');
  }
  return context;
};
