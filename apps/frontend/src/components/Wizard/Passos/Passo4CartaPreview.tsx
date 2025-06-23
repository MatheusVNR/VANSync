import React from 'react';
import CartaPreview from '../CartaPreview';

interface Passo4CartaPreviewProps {
    selectedProducts: string[];
    formData: any;
    bank: any;
    fornecedorVan?: string;
    onConfirm: () => void;
    onBack: () => void;
    loading: boolean;
}
  
const Passo4CartaPreview: React.FC<Passo4CartaPreviewProps> = ({ 
  selectedProducts, 
  formData, 
  bank,
  fornecedorVan = 'nexxera',
  onConfirm, 
  onBack, 
  loading 
}) => (
    <div>
      <CartaPreview 
        produtos={selectedProducts} 
        formData={formData}
        selectedBank={bank}
        fornecedorVan={fornecedorVan}
        onConfirm={onConfirm} 
        onBack={onBack}
        loading={loading}
      />
    </div>
);
  
export default Passo4CartaPreview;