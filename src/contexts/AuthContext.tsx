
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'organizer' | 'attendee') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions to manage users in localStorage
const getUsersFromStorage = () => {
  const users = localStorage.getItem('eventapp_users');
  if (users) {
    return JSON.parse(users);
  }
  
  // Initialize with default demo users if no users exist
  const defaultUsers = [
    { id: '1', email: 'organizer@example.com', password: 'password', name: 'John Organizer', role: 'organizer' },
    { id: '2', email: 'attendee@example.com', password: 'password', name: 'Jane Attendee', role: 'attendee' }
  ];
  localStorage.setItem('eventapp_users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

const saveUsersToStorage = (users: any[]) => {
  localStorage.setItem('eventapp_users', JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('eventapp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const users = getUsersFromStorage();
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const user = { id: foundUser.id, email: foundUser.email, name: foundUser.name, role: foundUser.role };
      setUser(user);
      localStorage.setItem('eventapp_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'organizer' | 'attendee'): Promise<boolean> => {
    setIsLoading(true);
    
    const users = getUsersFromStorage();
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role
    };
    
    // Add to users array and save
    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);
    
    // Log the user in
    const userForState = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    setUser(userForState);
    localStorage.setItem('eventapp_user', JSON.stringify(userForState));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventapp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
