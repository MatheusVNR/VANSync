import React, { useState } from 'react';
import StepWizard from 'react-step-wizard';
import MainLayout from '../../components/MainLayout';
import {
  Paper,
  Box,
  Typography,
  styled
} from '@mui/material';
import Passo1BancoSelection from '../../components/Wizard/Passos/Passo1BancoSelection';
import Passo2ProdutoSelection from '../../components/Wizard/Passos/Passo2ProdutoSelection';
import Passo3CartaForm from '../../components/Wizard/Passos/Passo3CartaForm';
import Passo4CartaPreview from '../../components/Wizard/Passos/Passo4CartaPreview';
import Sidebar from '../../components/Sidebar';

enum WizardStepEnum {
  BankSelection,
  ProductSelection,
  CartaForm,
  CartaPreview,
}

const StyledSidebar = styled(Paper)`
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  background-color: #f5f5f5;
`;

const StepButton = styled(Box)<{ active: boolean; completed?: boolean }>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: ${({ active }) => (active ? '#003f71' : '#f5f5f5')};
  color: ${({ active }) => (active ? '#ffffff' : '#333')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: ${({ active, completed }) => (active || completed ? 'pointer' : 'default')};
  opacity: ${({ active, completed }) => (!active && !completed ? 0.6 : 1)};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? '#003f71' : '#e0e0e0')};
  }
`;

const WizardCartaVan: React.FC = () => {
  const [wizard, setWizard] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(WizardStepEnum.BankSelection);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const steps = [
    { 
      title: '1. Instituição bancária', 
      description: 'Selecione uma instituição',
      step: WizardStepEnum.BankSelection
    },
    { 
      title: '2. Produtos', 
      description: 'Selecione um ou mais produtos',
      step: WizardStepEnum.ProductSelection
    },
    { 
      title: '3. Preenchimento de dados', 
      description: 'Preencha os dados solicitados',
      step: WizardStepEnum.CartaForm
    },
    { 
      title: '4. Conferir e validar', 
      description: 'Confirme os dados antes de enviar',
      step: WizardStepEnum.CartaPreview
    },
  ];

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      wizard.goToStep(stepIndex + 1);
      setCurrentStep(stepIndex);
    }
  };

  return (
    <MainLayout>
      sidebar = {
        <Sidebar
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      }

      <StepWizard
        instance={setWizard}
        onStepChange={(stats) => setCurrentStep(stats.activeStep - 1)}
        isLazyMount
      >
        <Passo1BancoSelection
          onNext={(banco) => {
            setSelectedBank(banco);
            wizard.nextStep();
          }}
        />

        <Passo2ProdutoSelection
          banco={selectedBank}
          onBack={() => wizard.previousStep()}
          onNext={(produtos) => {
            setSelectedProducts(produtos);
            wizard.nextStep();
          }}
        />

        <Passo3CartaForm
          bank={selectedBank}
          onBack={() => wizard.previousStep()}
          onNext={(data) => {
            setFormData(data);
            setPdfUrl('https://example.com/carta.pdf');
            wizard.nextStep();
          }}
        />

        <Passo4CartaPreview
          pdfUrl={pdfUrl}
          selectedProducts={selectedProducts}
          onBack={() => wizard.previousStep()}
          onConfirm={() => alert('Carta enviada! (teste)')}
        />
      </StepWizard>
    </MainLayout>
  );
};

export default WizardCartaVan;