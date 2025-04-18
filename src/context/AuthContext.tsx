
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  signout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For demo purposes, we'll simulate auth with localStorage
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('noteapp-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll accept any valid email/password
      // In a real app, this would validate against a backend
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('noteapp-user', JSON.stringify(mockUser));
      toast.success("Signed in successfully!");
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error("Failed to sign in. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('noteapp-user', JSON.stringify(mockUser));
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error("Failed to create account. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem('noteapp-user');
    toast.info("Signed out successfully");
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    signout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
