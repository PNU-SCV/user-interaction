import React, { createContext, ReactNode, useContext, useState } from 'react';

const placeName = 'PLACE_TEST';
const placeSiyeon = 'siyeon';

interface IPlaceContext {
  place: string;
  setPlace: (place: string) => void;
}

const PlaceContext = createContext<IPlaceContext | undefined>(undefined);

export const PlaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [place, setPlace] = useState<string>(() => placeName);
  // const [place, setPlace] = useState<string>(() => placeSiyeon);

  return (
    <PlaceContext.Provider
      value={{
        place,
        setPlace,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlaceContext = () => {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error('usePlace');
  }

  return context;
};
