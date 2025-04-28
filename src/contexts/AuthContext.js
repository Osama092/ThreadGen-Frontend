import React, { createContext, useContext, useEffect } from 'react';
import { useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user } = useClerkAuth(); 

  useEffect(() => {}, [isSignedIn, user]);

  return (
    <AuthContext.Provider value={{ isSignedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);