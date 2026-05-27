import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Mocking user for UI/UX phase
  const [currentUser, setCurrentUser] = useState({
    email: 'trader@souljournal.com',
    emailVerified: true,
    displayName: 'Master Trader'
  });
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setCurrentUser(null);
  };

  const verifyEmail = () => {
    return Promise.resolve();
  };

  const login = (email, password) => {
    setCurrentUser({ email, emailVerified: true });
    return Promise.resolve();
  };

  const signup = (email, password) => {
    setCurrentUser({ email, emailVerified: true });
    return Promise.resolve();
  };

  const value = {
    currentUser,
    logout,
    verifyEmail,
    login,
    signup,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
