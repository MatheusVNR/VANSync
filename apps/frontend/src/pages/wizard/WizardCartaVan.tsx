import React, { useState } from 'react';
import StepWizard from 'react-step-wizard';
import MainLayout from '../../components/MainLayout';
import WizardSidebar, { Step } from '../../components/Wizard/Base/WizardSideBar';
import Passo1BancoSelection from '../../components/Wizard/Passos/Passo1BancoSelection';
import Passo2ProdutoSelection from '../../components/Wizard/Passos/Passo2ProdutoSelection';
import Passo3CartaForm from '../../components/Wizard/Passos/Passo3CartaForm';
import Passo4CartaPreview from '../../components/Wizard/Passos/Passo4CartaPreview';

enum WizardStepEnum {
  BankSelection,
  ProductSelection,
  CartaForm,
  CartaPreview,
}

const WizardCartaVan: React.FC = () => {
  const [wizard, setWizard] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(WizardStepEnum.BankSelection);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const steps: Step[] = [
    { title: 'Instituição bancária', completed: currentStep > WizardStepEnum.BankSelection },
    { title: 'Produtos', completed: currentStep > WizardStepEnum.ProductSelection },
    { title: 'Preenchimento de dados', completed: currentStep > WizardStepEnum.CartaForm },
    { title: 'Conferir e validar', completed: currentStep > WizardStepEnum.CartaPreview },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row min-h-screen">
        <WizardSidebar steps={steps} currentStepIndex={currentStep} />
        <div className="flex-1 p-4 border-l">
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
                setFormData(data);   // apenas pra testar, depois vemos como definir pro pdf que gerarmos, mas já deixamos os dados prontos
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
        </div>
      </div>
    </MainLayout>
  );
};

export default WizardCartaVan;