import React from 'react';
import ProductSelection from '../ProdutoSelection';

interface Passo2ProdutoSelectionProps {
    banco: { produtos: string } | null;
    onNext: (selectedProducts: string[]) => void;
    onBack: () => void;
}
  
const Passo2ProdutoSelection: React.FC<Passo2ProdutoSelectionProps> = ({ banco, onNext, onBack }) => (
    <div>
      <ProductSelection
        banco={banco!}
        onProductsSelected={(products) => onNext(products)}
        onBack={onBack}
      />
    </div>
);
  
export default Passo2ProdutoSelection;