import React, { useState, useEffect } from 'react';
import StepWizard from 'react-step-wizard';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  MobileStepper,
  Button,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Check as CheckIcon,
} from '@mui/icons-material';
import Passo1BancoSelection from '../../components/Wizard/Passos/Passo1BancoSelection';
import Passo2ProdutoSelection from '../../components/Wizard/Passos/Passo2ProdutoSelection';
import Passo3CartaForm from '../../components/Wizard/Passos/Passo3CartaForm';
import Passo4CartaPreview from '../../components/Wizard/Passos/Passo4CartaPreview';
import Header from '../../components/Header';
import { solicitacaoService, SolicitacaoCarta } from '../../services/solicitacaoService';
import { authService } from '../../services/authService';

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
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = [
    { 
      title: 'Instituição bancária', 
      description: 'Selecione uma instituição',
      step: WizardStepEnum.BankSelection
    },
    { 
      title: 'Produtos', 
      description: 'Selecione um ou mais produtos',
      step: WizardStepEnum.ProductSelection
    },
    { 
      title: 'Preenchimento de dados', 
      description: 'Preencha os dados solicitados',
      step: WizardStepEnum.CartaForm
    },
    { 
      title: 'Conferir e validar', 
      description: 'Confirme os dados antes de enviar',
      step: WizardStepEnum.CartaPreview
    },
  ];

  const handleStepChange = (stats: any) => {
    const newStep = stats.activeStep - 1;
    setCurrentStep(newStep);
    
    // Marcar passos anteriores como concluídos
    const newCompletedSteps = new Set(completedSteps);
    for (let i = 0; i < newStep; i++) {
      newCompletedSteps.add(i);
    }
    setCompletedSteps(newCompletedSteps);
  };

  const handleStepComplete = (stepIndex: number) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(stepIndex);
    setCompletedSteps(newCompletedSteps);
  };

  const handleConfirm = async () => {
    if (!selectedBank || !selectedProducts.length || !formData) {
      setError('Dados incompletos para criar a solicitação');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const currentUser = authService.getCurrentUser();
      
      const solicitacao: SolicitacaoCarta = {
        banco_id: selectedBank.codigo,
        produtos: selectedProducts,
        cnpj_software_house: formData.cnpjSoftwareHouse,
        cnpj_emitente: formData.cnpjEmitente,
        razao_social: formData.razaoSocial,
        nome_responsavel: formData.nomeResponsavel,
        cargo_responsavel: formData.cargoResponsavel,
        telefone: formData.telefone,
        email: formData.email,
        agencia: formData.agencia,
        agencia_dv: formData.agenciaDV,
        conta: formData.conta,
        conta_dv: formData.contaDV,
        convenio: formData.convenio,
        cnab: formData.cnab,
        nome_gerente: formData.nomeGerente,
        telefone_gerente: formData.telefoneGerente,
        email_gerente: formData.emailGerente,
      };

      // Criar solicitação e gerar PDFs
      const response = await solicitacaoService.create(solicitacao);
      
      // Enviar emails das cartas
      await solicitacaoService.sendCartasEmail(response.id);
      
      // Integrar com Zapier
      await solicitacaoService.integrateZapier(response.id);
      
      setSuccess(`Solicitação criada com sucesso! ${selectedProducts.length} carta${selectedProducts.length > 1 ? 's' : ''} enviadas por e-mail e integradas via Zapier.`);
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/menu');
      }, 3000);
      
    } catch (err: any) {
      console.error('Erro ao criar solicitação:', err);
      setError(err.message || 'Erro ao criar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header />

      {/* Conteúdo principal */}
      <Box 
        sx={{ 
          flex: 1,
          marginTop: '64px', // Altura do header
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {/* Header do Wizard */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              Geração de Carta VAN
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary"
            >
              Preencha os dados para criar uma nova solicitação de carta
            </Typography>
          </Box>

          {/* Stepper - Desktop */}
          {!isMobile && (
            <Paper sx={{ mb: 4, p: 3 }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel
                      StepIconComponent={({ active, completed }) => {
                        if (completed) {
                          return (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: theme.palette.success.main,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                              }}
                            >
                              <CheckIcon sx={{ fontSize: 16 }} />
                            </Box>
                          );
                        }
                        return (
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: active ? 'white' : theme.palette.text.secondary,
                              fontWeight: active ? 'bold' : 'normal',
                            }}
                          >
                            {index + 1}
                          </Box>
                        );
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {step.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          )}

          {/* Mobile Stepper */}
          {isMobile && (
            <Box sx={{ mb: 3 }}>
              <MobileStepper
                variant="progress"
                steps={steps.length}
                position="static"
                activeStep={currentStep}
                sx={{
                  backgroundColor: 'transparent',
                  '& .MuiMobileStepper-progress': {
                    backgroundColor: theme.palette.grey[200],
                  },
                  '& .MuiMobileStepper-progressBar': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
                nextButton={
                  <Button
                    size="small"
                    onClick={() => wizard?.nextStep()}
                    disabled={currentStep === steps.length - 1}
                  >
                    Próximo
                    <KeyboardArrowRight />
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={() => wizard?.previousStep()}
                    disabled={currentStep === 0}
                  >
                    <KeyboardArrowLeft />
                    Anterior
                  </Button>
                }
              />
              
              {/* Indicador de passo atual */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {steps[currentStep].title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {steps[currentStep].description}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Conteúdo do Wizard */}
          <Box sx={{ 
            backgroundColor: 'white',
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            overflow: 'hidden',
          }}>
            <StepWizard
              instance={setWizard}
              onStepChange={handleStepChange}
              isLazyMount
            >
              <Passo1BancoSelection
                selectedBank={selectedBank}
                onNext={(banco) => {
                  setSelectedBank(banco);
                  handleStepComplete(WizardStepEnum.BankSelection);
                  wizard.nextStep();
                }}
              />

              <Passo2ProdutoSelection
                banco={selectedBank}
                selectedProducts={selectedProducts}
                onBack={() => wizard.previousStep()}
                onNext={(produtos) => {
                  setSelectedProducts(produtos);
                  handleStepComplete(WizardStepEnum.ProductSelection);
                  wizard.nextStep();
                }}
              />

              <Passo3CartaForm
                bank={selectedBank}
                selectedProducts={selectedProducts}
                formData={formData}
                onBack={() => wizard.previousStep()}
                onNext={(data) => {
                  setFormData(data);
                  handleStepComplete(WizardStepEnum.CartaForm);
                  wizard.nextStep();
                }}
              />

              <Passo4CartaPreview
                selectedProducts={selectedProducts}
                formData={formData}
                selectedBank={selectedBank}
                onBack={() => wizard.previousStep()}
                onConfirm={handleConfirm}
                loading={loading}
              />
            </StepWizard>
          </Box>
        </Container>
      </Box>

      {/* Snackbars para feedback */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WizardCartaVan;