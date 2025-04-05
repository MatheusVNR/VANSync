import React from 'react';
import CartaForm from '../CartaForm';

interface Passo3CartaFormProps {
    bank: { nome: string } | null;
    onNext: (formData: any) => void;
    onBack: () => void;
}
  
const Passo3CartaForm: React.FC<Passo3CartaFormProps> = ({ bank, onNext, onBack }) => (
    <div>
      <CartaForm 
        banco={bank!} 
        onSubmit={(data) => onNext(data)} 
        onBack={onBack} 
      />
    </div>
);
  
export default Passo3CartaForm;