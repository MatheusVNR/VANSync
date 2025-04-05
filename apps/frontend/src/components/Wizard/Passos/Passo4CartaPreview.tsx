import React from 'react';
import CartaPreview from '../CartaPreview';

interface Passo4CartaPreviewProps {
    pdfUrl: string;
    selectedProducts: string[];
    onConfirm: () => void;
    onBack: () => void;
}
  
const Passo4CartaPreview: React.FC<Passo4CartaPreviewProps> = ({ pdfUrl, selectedProducts, onConfirm, onBack }) => (
    <div>
      <CartaPreview 
        pdfUrl={pdfUrl} 
        produtos={selectedProducts} 
        onConfirm={onConfirm} 
        onBack={onBack} 
      />
    </div>
);
  
export default Passo4CartaPreview;