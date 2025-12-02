import React, { createContext } from 'react';
export const PlateContext = createContext(null);
export function PlateProvider({ children }){
  return <PlateContext.Provider value={{}}>{children}</PlateContext.Provider>;
}
