'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut, getRedirectResult } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  token: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const firebaseConfig = {
    apiKey: "AIzaSyBZHavEWbWJikh20WOZMLkWs2beoz_TPzE",
    authDomain: "surplus-aed79.firebaseapp.com",
    projectId: "surplus-aed79",
    storageBucket: "surplus-aed79.firebaseapp.com",
    messagingSenderId: "992402453671",
    appId: "1:992402453671:web:0e9b0a92bc9ce7167c5782",
    measurementId: "G-3KJHKHQJXW",
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const fetchAuthToken = async () => {
      const userCredential = await getRedirectResult(auth);
      if (userCredential) {
        const authToken = await userCredential.user.getIdToken();
        setToken(authToken ?? null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      // Fetch token for authenticated users
      if (user) {
        user.getIdToken().then(setToken).catch(() => setToken(null));
      } else {
        setToken(null);
      }
    });

    fetchAuthToken(); // Handle redirect result

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
