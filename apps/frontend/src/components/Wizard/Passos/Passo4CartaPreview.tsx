import React from 'react';
import CartaPreview from '../CartaPreview';

interface Passo4CartaPreviewProps {
    selectedProducts: string[];
    formData: any;
    selectedBank: any;
    onConfirm: () => void;
    onBack: () => void;
    loading: boolean;
}
  
const Passo4CartaPreview: React.FC<Passo4CartaPreviewProps> = ({ 
  selectedProducts, 
  formData, 
  selectedBank, 
  onConfirm, 
  onBack, 
  loading 
}) => (
    <div>
      <CartaPreview 
        produtos={selectedProducts} 
        formData={formData}
        selectedBank={selectedBank}
        onConfirm={onConfirm} 
        onBack={onBack}
        loading={loading}
      />
    </div>
);
  
export default Passo4CartaPreview;