import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, loginUser, registerUser, getUserData } from '../services/localStorage';

interface AuthContextType {
  currentUser: User | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setUserData(user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      setUserData(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, role: string, name: string) => {
    try {
      const user = await registerUser(email, password, role, name);
      setCurrentUser(user);
      setUserData(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      setUserData(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 