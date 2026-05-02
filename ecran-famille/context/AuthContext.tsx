import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ParentData {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  parent: ParentData | null;
  isLoading: boolean;
  login: (parentData: ParentData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [parent, setParent] = useState<ParentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger la session au démarrage
    const loadStorageData = async () => {
      try {
        const authDataSerialized = await AsyncStorage.getItem('@parent_session');
        if (authDataSerialized) {
          const _parentData: ParentData = JSON.parse(authDataSerialized);
          setParent(_parentData);
        }
      } catch (e) {
        console.error('Erreur lors du chargement de la session', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (parentData: ParentData) => {
    try {
      setParent(parentData);
      await AsyncStorage.setItem('@parent_session', JSON.stringify(parentData));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de la session', e);
    }
  };

  const logout = async () => {
    try {
      setParent(null);
      await AsyncStorage.removeItem('@parent_session');
    } catch (e) {
      console.error('Erreur lors de la déconnexion', e);
    }
  };

  return (
    <AuthContext.Provider value={{ parent, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
