import React from 'react';
import BancoSelection from '../BancoSelection';

interface Passo1BancoSelectionProps {
    onNext: (selectedBank: any) => void;
}

// const Passo1BancoSelection: React.FC<Passo1BancoSelectionProps> = ({ onNext }) => (
//     <div>
//         <BancoSelection 
//             onBancoSelected={(banco) => onNext(banco)} 
//         />
//     </div>
// );
const Passo1BancoSelection: React.FC<Passo1BancoSelectionProps> = ({ onNext }) => (
    <BancoSelection onNext={onNext} />
);

export default Passo1BancoSelection;