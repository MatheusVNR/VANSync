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
  const [fornecedorVan, setFornecedorVan] = useState<string>('nexxera');
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
    try {
      const newStep = stats.activeStep - 1;
      const previousStep = currentStep;
      
      // Validação de segurança
      if (newStep < 0 || newStep >= steps.length) {
        console.error('❌ Passo inválido:', newStep);
        return;
      }
      
      setCurrentStep(newStep);
      
      // Se está voltando (newStep < previousStep), resetar estado dos passos seguintes
      if (newStep < previousStep) {
        // Usar setTimeout para garantir que setCurrentStep execute primeiro
        setTimeout(() => {
          resetStepsFromIndex(newStep + 1);
        }, 0);
      } else {
        // Marcar passos anteriores como concluídos
        const newCompletedSteps = new Set(completedSteps);
        for (let i = 0; i < newStep; i++) {
          newCompletedSteps.add(i);
        }
        setCompletedSteps(newCompletedSteps);
      }
      
      // Validação de consistência do estado
      validateStepConsistency(newStep);
    } catch (error) {
      console.error('❌ Erro ao mudar passo:', error);
      setError('Erro ao navegar entre os passos. Tente novamente.');
    }
  };

  // Função para validar consistência do estado em cada passo
  const validateStepConsistency = (step: number) => {
    try {
      const issues = [];
      
      // Verificar se o banco está selecionado quando necessário
      if (step >= WizardStepEnum.ProductSelection && !selectedBank) {
        issues.push('Banco não selecionado');
      }
      
      // Verificar se produtos estão selecionados quando necessário
      if (step >= WizardStepEnum.CartaForm && selectedProducts.length === 0) {
        issues.push('Nenhum produto selecionado');
      }
      
      // Verificar se formulário está preenchido quando necessário
      if (step >= WizardStepEnum.CartaPreview && Object.keys(formData).length === 0) {
        issues.push('Formulário não preenchido');
      }
      
    } catch (error) {
      console.error('❌ Erro na validação de consistência:', error);
    }
  };

  // Função para resetar estado dos passos a partir de um índice
  const resetStepsFromIndex = (startIndex: number) => {
    try {
      // Validação de entrada
      if (startIndex < 0 || startIndex > steps.length) {
        console.error('❌ Índice de reset inválido:', startIndex);
        return;
      }
      
      // Resetar produtos se voltar do passo 3 ou 4 para o passo 2 ou anterior
      if (startIndex <= WizardStepEnum.ProductSelection) {
        setSelectedProducts([]);
      }
      
      // Resetar formulário se voltar do passo 4 para o passo 3 ou anterior
      if (startIndex <= WizardStepEnum.CartaForm) {
        setFormData({});
      }
      
      // Resetar fornecedor VAN se voltar para o passo 2 ou anterior
      if (startIndex <= WizardStepEnum.ProductSelection) {
        setFornecedorVan('nexxera');
      }
      
      // Remover passos concluídos a partir do índice
      const newCompletedSteps = new Set(completedSteps);
      for (let i = startIndex; i < steps.length; i++) {
        newCompletedSteps.delete(i);
      }
      setCompletedSteps(newCompletedSteps);
      
    } catch (error) {
      console.error('❌ Erro ao resetar estado:', error);
      // Em caso de erro, resetar tudo para garantir consistência
      setSelectedProducts([]);
      setFormData({});
      setFornecedorVan('nexxera');
      setCompletedSteps(new Set());
    }
  };

  // Função para voltar com reset adequado do estado
  const handleBack = (targetStep: number) => {
    try {
      // Validações de segurança
      if (!wizard) {
        console.error('❌ Wizard não inicializado');
        return;
      }
      
      if (targetStep < 0 || targetStep >= steps.length) {
        console.error('❌ Passo de destino inválido:', targetStep);
        return;
      }
      
      if (targetStep >= currentStep) {
        console.error('❌ Tentativa de voltar para passo futuro:', targetStep, '>=', currentStep);
        return;
      }
      
      // Resetar estado dos passos que serão "pulados"
      resetStepsFromIndex(targetStep + 1);
      
      // Navegar para o passo desejado com proteção contra loops
      const stepsToGoBack = currentStep - targetStep;
      const maxAttempts = stepsToGoBack + 2; // +2 para margem de segurança
      let attempts = 0;
      
      for (let i = 0; i < stepsToGoBack && attempts < maxAttempts; i++) {
        try {
          wizard.previousStep();
          attempts++;
        } catch (stepError) {
          console.error('❌ Erro ao voltar passo:', stepError);
          break;
        }
      }
      
      if (attempts >= maxAttempts) {
        console.error('❌ Loop infinito detectado ao voltar passos');
        setError('Erro ao navegar. Recarregue a página.');
      }
      
    } catch (error) {
      console.error('❌ Erro na função handleBack:', error);
      setError('Erro ao voltar. Tente novamente.');
    }
  };

  const handleStepComplete = (stepIndex: number) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(stepIndex);
    setCompletedSteps(newCompletedSteps);
  };

  const handleProductToggle = (produto: string) => {
    setSelectedProducts(prev => 
      prev.includes(produto)
        ? prev.filter(p => p !== produto)
        : [...prev, produto]
    );
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
      
      if (!currentUser?.cnpj) {
        throw new Error('Usuário não autenticado ou CNPJ não encontrado');
      }
      
      const solicitacao: SolicitacaoCarta = {
        cnpj: currentUser.cnpj,
        banco_id: selectedBank.codigo,
        produtos: selectedProducts,
        fornecedor_van: fornecedorVan,
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

      // 1. Criar solicitação
      const response = await solicitacaoService.create(solicitacao);
      
      // 2. Processar completo (emails + zapier + finalização)
      const resultadoProcessamento = await solicitacaoService.processarCompleto(response.id);
      
      if (resultadoProcessamento.success) {
        const { resultados } = resultadoProcessamento;
        
        const mensagem = [
          `Solicitação criada com sucesso!`,
          `📧 ${resultados.emails.emailsEnviados}/${selectedProducts.length} emails enviados`,
          `🔗 ${resultados.zapier.integracoesEnviadas}/${selectedProducts.length} integrações Zapier realizadas`,
          `🏁 Solicitação finalizada`
        ].join('\n');
        
        setSuccess(mensagem);
        
        // Redirecionar após 5 segundos
        setTimeout(() => {
          navigate('/menu');
        }, 5000);
      } else {
        throw new Error(resultadoProcessamento.message);
      }
      
    } catch (err: any) {
      console.error('❌ Erro ao processar solicitação:', err);
      setError(err.message || 'Erro ao processar solicitação');
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
                    onClick={() => handleBack(Math.max(0, currentStep - 1))}
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
            {wizard ? (
              <StepWizard
                instance={setWizard}
                onStepChange={handleStepChange}
                isLazyMount
              >
                <Passo1BancoSelection
                  onNext={(bankData) => {
                    setSelectedBank(bankData);
                    handleStepComplete(WizardStepEnum.BankSelection);
                    wizard.nextStep();
                  }}
                />

                <Passo2ProdutoSelection
                  bank={selectedBank}
                  selectedProducts={selectedProducts}
                  onProductToggle={handleProductToggle}
                  onBack={() => handleBack(WizardStepEnum.BankSelection)}
                  onNext={() => {
                    setFornecedorVan(selectedBank?.padrao_van || 'nexxera');
                    handleStepComplete(WizardStepEnum.ProductSelection);
                    wizard.nextStep();
                  }}
                />

                <Passo3CartaForm
                  bank={selectedBank}
                  selectedProducts={selectedProducts}
                  formData={formData}
                  fornecedorVan={fornecedorVan}
                  onBack={() => handleBack(WizardStepEnum.ProductSelection)}
                  onNext={(data) => {
                    setFormData(data);
                    handleStepComplete(WizardStepEnum.CartaForm);
                    wizard.nextStep();
                  }}
                />

                <Passo4CartaPreview
                  bank={selectedBank}
                  selectedProducts={selectedProducts}
                  formData={formData}
                  fornecedorVan={fornecedorVan}
                  onBack={() => handleBack(WizardStepEnum.CartaForm)}
                  onConfirm={handleConfirm}
                  loading={loading}
                />
              </StepWizard>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Carregando wizard...
                </Typography>
              </Box>
            )}
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