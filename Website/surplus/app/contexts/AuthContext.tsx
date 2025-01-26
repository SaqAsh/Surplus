'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  const firebaseConfig = {
    apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
    authDomain: "surplus-aed79.firebaseapp.com",
    projectId: "surplus-aed79",
    storageBucket: "surplus-aed79.firebasestorage.app",
    messagingSenderId: "992402453671",
    appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782",
    measurementId: "G-3KJHKHQJXW"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 