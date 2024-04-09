import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Call the verifyAuth function here or any similar function 
    // that checks the auth status by contacting the backend
    verifyAuth().then((isValid) => setIsAuthenticated(isValid));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook to use auth context
export const useAuth = () => useContext(AuthContext);
