import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Bank {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  responsavelNome: string;
  responsavelCargo: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  banco: string;
  agencia: string;
  conta: string;
  convenio: string;
  gerenteConta: string;
  gerenteTelefone: string;
  gerenteEmail: string;
}

interface VanDataType {
  selectedBank: Bank | null;
  selectedProducts: Product[];
  companyData: CompanyData | null;
  letterType: string | null;
}

interface VanContextType {
  vanData: VanDataType;
  updateVanData: (newData: Partial<VanDataType>) => void;
  resetVanData: () => void;
}

interface VanProviderProps {
  children: ReactNode;
}

const VanContext = createContext<VanContextType | undefined>(undefined);

export function VanProvider({ children }: VanProviderProps): React.ReactElement {
  const [vanData, setVanData] = useState<VanDataType>({
    selectedBank: { id: 'default', name: 'Banco Padrão' },
    selectedProducts: [{ id: 'default', name: 'Boletos' }],
    companyData: null,
    letterType: 'boletos',
  });

  const updateVanData = (newData: Partial<VanDataType>): void => {
    setVanData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetVanData = (): void => {
    setVanData({
      selectedBank: { id: 'default', name: 'Banco Padrão' },
      selectedProducts: [{ id: 'default', name: 'Boletos' }],
      companyData: null,
      letterType: 'boletos',
    });
  };

  return (
    <VanContext.Provider value={{ vanData, updateVanData, resetVanData }}>
      {children}
    </VanContext.Provider>
  );
}

export function useVan(): VanContextType {
  const context = useContext(VanContext);
  if (!context) {
    throw new Error('useVan must be used within a VanProvider');
  }
  return context;
} 