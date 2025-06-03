
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
    
    // Mock authentication - replace with actual API call
    const mockUsers = [
      { id: '1', email: 'organizer@example.com', password: 'password', name: 'John Organizer', role: 'organizer' as const },
      { id: '2', email: 'attendee@example.com', password: 'password', name: 'Jane Attendee', role: 'attendee' as const }
    ];
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
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
    
    // Mock registration - replace with actual API call
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role
    };
    
    setUser(newUser);
    localStorage.setItem('eventapp_user', JSON.stringify(newUser));
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
