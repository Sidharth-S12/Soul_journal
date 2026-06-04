import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Real Firebase Auth listener ───────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);   // user.uid is always present when logged in
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Auth methods ──────────────────────────────────────────────────────────
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const verifyEmail = () =>
    currentUser ? sendEmailVerification(currentUser) : Promise.resolve();

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email);

  const value = {
    currentUser,   // always has .uid when logged in via Firebase
    loading,
    login,
    signup,
    logout,
    verifyEmail,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}