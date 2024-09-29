import React, { createContext, useContext, useEffect } from 'react';
import { useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react'; // Import Clerk's useAuth

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user } = useClerkAuth(); // Destructure isSignedIn and user from Clerk's useAuth

  useEffect(() => {
    console.log('useEffect triggered');

    if (!isSignedIn) {
      console.log('No one is here');

    } else {
      console.log('Yeah, the user is here');

    }
  }, [isSignedIn, user]); // Effect dependencies to trigger on auth status change
  console.log('AuthProvider render:', user);

  return (
    <AuthContext.Provider value={{ isSignedIn, user }}> {/* Provide both isSignedIn and user in context */}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuthContext = () => useContext(AuthContext);