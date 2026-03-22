import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth=()=> {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps>=({
    children
})=> {
    const [user, setUser] = useState<User | null>(()=> {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(false);

    const login = async(credentials: LoginCredentials)=> {
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: '1',
                name: 'John Doe',
                email: credentials.email,
                avatar: 'https://i.pravatar.cc/150?img=1',
                createdAt: new Date(),
            }

            if (credentials.rememberMe) {
                localStorage.setItem("user", JSON.stringify(mockUser));
            } else {
                localStorage.setItem("user", JSON.stringify(mockUser));
            }
            
            setUser(mockUser);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false)
        }
    }     

    const register=async(credentials: LoginCredentials)=> {
        setIsLoading(true);

        try {

        await new Promise(resolve => setTimeout(resolve, 10000));

        const mockUser = {
            id: '1',
            name: 'John Doe',
            email: credentials.email,
            avatar: 'https://i.pravatar.cc/150?img=1',
            createdAt: new Date(),
        }

        if (credentials.rememberMe) {
            localStorage.setItem("user", JSON.stringify(mockUser));
        } else {
            localStorage.setItem("user", JSON.stringify(mockUser))
        }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const logout=()=> {
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
    }

    return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>)
}