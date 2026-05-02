import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AgentData {
  _id: string;
  name: string;
  identifier: string;
  prefecture: string;
  establishment: string;
  role?: string;
}

interface AuthContextType {
  agent: AgentData | null;
  isLoading: boolean;
  login: (agentData: AgentData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger la session au démarrage
    const loadStorageData = async () => {
      try {
        const authDataSerialized = await AsyncStorage.getItem('@agent_session');
        if (authDataSerialized) {
          const _agentData: AgentData = JSON.parse(authDataSerialized);
          setAgent(_agentData);
        }
      } catch (e) {
        console.error('Erreur lors du chargement de la session', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (agentData: AgentData) => {
    try {
      setAgent(agentData);
      await AsyncStorage.setItem('@agent_session', JSON.stringify(agentData));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de la session', e);
    }
  };

  const logout = async () => {
    try {
      setAgent(null);
      await AsyncStorage.removeItem('@agent_session');
    } catch (e) {
      console.error('Erreur lors de la déconnexion', e);
    }
  };

  return (
    <AuthContext.Provider value={{ agent, isLoading, login, logout }}>
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
