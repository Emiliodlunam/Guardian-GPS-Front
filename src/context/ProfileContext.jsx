import React, { createContext } from 'react';
export const ProfileContext = createContext(null);
export function ProfileProvider({ children }){
  return <ProfileContext.Provider value={{}}>{children}</ProfileContext.Provider>;
}
