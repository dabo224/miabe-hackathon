import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DeclarationData {
  // Enfant
  prenom: string;
  nom: string;
  sexe: 'M' | 'F';
  dateNaissance: string;
  heure: string;
  nationaliteEnfant: string;
  lieuNaissance: {
    region: string;
    prefecture: string;
    sousPrefecture: string;
  };
  
  // Mère
  mere: {
    nom: string;
    id: string;
    dateNaissance: string;
    nationalite: string;
    profession: string;
  };
  
  // Père
  pere: {
    nom: string;
    id: string;
    dateNaissance: string;
    nationalite: string;
    profession: string;
  };

  // Déclarant
  declarant: {
    nom: string;
    id: string;
    lien: string;
  };
}

interface DeclarationContextType {
  formData: DeclarationData;
  updateData: (data: Partial<DeclarationData>) => void;
  clearData: () => void;
}

const defaultData: DeclarationData = {
  prenom: '',
  nom: '',
  sexe: 'M',
  dateNaissance: '',
  heure: '',
  nationaliteEnfant: 'GUINÉENNE',
  lieuNaissance: {
    region: 'CONAKRY',
    prefecture: 'CONAKRY',
    sousPrefecture: ''
  },
  mere: { nom: '', id: '', dateNaissance: '', nationalite: 'GUINÉENNE', profession: '' },
  pere: { nom: '', id: '', dateNaissance: '', nationalite: 'GUINÉENNE', profession: '' },
  declarant: { nom: '', id: '', lien: 'MÈRE' }
};

const DeclarationContext = createContext<DeclarationContextType | undefined>(undefined);

export function DeclarationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<DeclarationData>(defaultData);

  const updateData = (data: Partial<DeclarationData>) => {
    setFormData((prev) => ({ 
      ...prev, 
      ...data,
      // Handle nested updates if passed partially
      mere: { ...prev.mere, ...data.mere },
      pere: { ...prev.pere, ...data.pere },
      lieuNaissance: { ...prev.lieuNaissance, ...data.lieuNaissance },
      declarant: { ...prev.declarant, ...data.declarant }
    }));
  };

  // Fixed update function to properly merge complex partials
  const safeUpdateData = (data: any) => {
    setFormData((prev: any) => {
        const newData = { ...prev };
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
                newData[key] = { ...prev[key], ...data[key] };
            } else {
                newData[key] = data[key];
            }
        });
        return newData;
    });
  };

  const clearData = () => {
    setFormData(defaultData);
  };

  return (
    <DeclarationContext.Provider value={{ formData, updateData: safeUpdateData, clearData }}>
      {children}
    </DeclarationContext.Provider>
  );
}

export function useDeclaration() {
  const context = useContext(DeclarationContext);
  if (context === undefined) {
    throw new Error('useDeclaration must be used within a DeclarationProvider');
  }
  return context;
}
