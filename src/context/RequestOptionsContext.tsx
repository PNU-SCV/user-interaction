import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface RequestOptionsContextType {
  waitTime: number;
  cancelIfUnconfirmed: boolean;
  setWaitTime: (time: number) => void;
  setCancelIfUnconfirmed: (cancel: boolean) => void;
  destMsgs: string[];
  setDestMsgs: (msgs: (prev) => any[]) => void;
  disableInputs: boolean;
  setDisableInputs: (newStat: boolean) => void;
}

const RequestOptionsContext = createContext<RequestOptionsContextType | undefined>(undefined);

export const RequestOptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [waitTime, setWaitTime] = useState<number>(10);
  const [cancelIfUnconfirmed, setCancelIfUnconfirmed] = useState<boolean>(false);
  const [destMsgs, setDestMsgs] = useState<string[]>([]);
  const [disableInputs, setDisableInputs] = useState(false);

  const value = {
    waitTime,
    cancelIfUnconfirmed,
    destMsgs,
    disableInputs,
    setWaitTime,
    setCancelIfUnconfirmed,
    setDestMsgs,
    setDisableInputs,
  };

  return <RequestOptionsContext.Provider value={value}>{children}</RequestOptionsContext.Provider>;
};

export const useRequestOptions = () => {
  const context = useContext(RequestOptionsContext);
  if (!context) {
    throw new Error('useRequestOptions must be used within a RequestOptionsProvider');
  }
  return context;
};
