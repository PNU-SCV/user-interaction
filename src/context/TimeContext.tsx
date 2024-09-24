import React, { createContext, ReactNode, useContext, useRef } from 'react';

type SelectedTime = {
  date: string;
  time: string;
  start: string;
  end: string;
};

interface ITimeContext {
  selectedTime: SelectedTime;
  setSelectedTime: (selectedTime: SelectedTime) => void;
}

const TimeContext = createContext<ITimeContext | undefined>(undefined);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const [selectedTime, setSelectedTime] = useState<SelectedTime | undefined>(() => undefined);
  const selectedTimeRef = useRef<SelectedTime | undefined>(undefined);
  const setSelectedTime = (selectedTime: SelectedTime) => {
    selectedTimeRef.current = selectedTime;
  };

  const contextValue = {
    selectedTime: selectedTimeRef.current,
    setSelectedTime,
  } as ITimeContext;

  return <TimeContext.Provider value={contextValue}>{children}</TimeContext.Provider>;
};

export const useTimeContext = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime');
  }

  return context;
};
