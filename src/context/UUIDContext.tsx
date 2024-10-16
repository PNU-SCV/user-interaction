import React, { createContext, useContext, useEffect, useState } from 'react';

const UniqueIdContext = createContext<string>('');

export const UniqueIdProvider = ({ children }) => {
  const [uniqueId, setUniqueId] = useState(() => {
    const savedId = localStorage.getItem('unique_id');
    return savedId ? savedId : generateUUID();
  });

  useEffect(() => {
    localStorage.setItem('unique_id', uniqueId);
  }, [uniqueId]);

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  return <UniqueIdContext.Provider value={uniqueId}>{children}</UniqueIdContext.Provider>;
};

export const useUniqueId = () => {
  return useContext(UniqueIdContext);
};
