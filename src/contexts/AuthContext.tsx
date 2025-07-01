import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient' | 'moderator' | 'clinic' | 'hospital' | 'pharmacy' | 'laboratory';
  permissions: string[];
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  permissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user for demonstration
const mockAdminUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@medical.com',
  role: 'admin',
  permissions: [
    'dashboard',
    'user_management',
    'moderators',
    'control_doctors',
    'control_patients', 
    'control_pharmacy',
    'medical_records',
    'appointments',
    'analytics',
    'settings'
  ],
  isActive: true
};

// Mock regular user
const mockRegularUser: User = {
  id: '2',
  name: 'Regular User',
  email: 'user@medical.com',
  role: 'patient',
  permissions: [
    'dashboard',
    'appointments',
    'medical_records'
  ],
  isActive: true
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/backend/api/index.php/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        // Save user info (including role/account type)
        const userData = {
          id: data.data.user_id || '',
          name: data.data.name || '',
          email: data.data.email || email,
          role: data.data.role || '',
          permissions: data.data.permissions || [],
          isActive: data.data.status === 'active',
        };
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.isActive) return false;
    return user.permissions.includes(permission) || user.role === 'admin';
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      logout,
      hasPermission,
      permissions: user?.permissions || []
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 