import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FormData {
  // Enfant
  prenom: string;
  nom: string;
  sexe: 'M' | 'F';
  dateNaissance: string;
  heure: string;
  lieuNaissance: {
    region: string;
    prefecture: string;
    sousPrefecture: string;
  };
  nationaliteEnfant: string;
  
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

  // Localisation & Contact
  contact: {
    telephone: string;
    quartier: string;
    secteur: string;
  };

  // Déclarant
  declarant: {
    nom: string;
    id: string;
    lien: string;
  };
}

interface RegistrationContextType {
  formData: FormData;
  updateData: (data: Partial<FormData>) => void;
  clearData: () => void;
}

const defaultData: FormData = {
  prenom: '',
  nom: '',
  sexe: 'M',
  dateNaissance: '',
  heure: '',
  lieuNaissance: {
    region: 'CONAKRY',
    prefecture: 'CONAKRY',
    sousPrefecture: 'MATOTO'
  },
  nationaliteEnfant: 'GUINÉENNE',
  mere: { nom: '', id: '', dateNaissance: '', nationalite: 'GUINÉENNE', profession: '' },
  pere: { nom: '', id: '', dateNaissance: '', nationalite: 'GUINÉENNE', profession: '' },
  contact: { telephone: '', quartier: '', secteur: '' },
  declarant: { nom: '', id: '', lien: 'PERE' }
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultData);

  const updateData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const clearData = () => {
    setFormData(defaultData);
  };

  return (
    <RegistrationContext.Provider value={{ formData, updateData, clearData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}
