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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
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
  const [openConfirm, setOpenConfirm] = useState(false);
  
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

      // Array para armazenar resultados de cada produto
      const resultados = [];
      let solicitacoesCriadas = 0;
      let emailsEnviados = 0;
      let integracoesZapier = 0;

      // Processar cada produto separadamente
      for (const produto of selectedProducts) {
        try {
          console.log(`🔄 Processando produto: ${produto}`);
          
          // 1. Gerar PDF para este produto (para enviar ao Zapier)
          const pdfData = {
            banco_id: selectedBank.codigo,
            produtos: [produto], // Array com um produto
            formData: {
              razao_social: formData.razaoSocial,
              cnpj_emitente: formData.cnpjEmitente,
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
              cnpj_software_house: formData.cnpjSoftwareHouse
            },
            fornecedor_van: fornecedorVan
          };

          const pdfResult = await solicitacaoService.generatePreviewPDFs(pdfData);
          if (!pdfResult.success || !pdfResult.pdfs || pdfResult.pdfs.length === 0) {
            throw new Error(`Falha ao gerar PDF para ${produto}`);
          }

          const pdfCarta = pdfResult.pdfs.find(pdf => pdf.produto === produto);
          if (!pdfCarta) {
            throw new Error(`PDF não encontrado para ${produto}`);
          }

          // 2. Enviar para Zapier primeiro (com PDF em base64)
          const zapierData = {
            cnpj_sh: currentUser.cnpj,
            email: formData.email,
            cnpj_cliente: formData.cnpjEmitente,
            produto: produto,
            arquivo: pdfCarta.pdfBase64
          };

          const zapierResult = await solicitacaoService.integrateZapierDirect(zapierData);
          if (!zapierResult.success) {
            throw new Error(`Falha no Zapier para ${produto}: ${zapierResult.message}`);
          }

          integracoesZapier++;
          console.log(`✅ Zapier integrado para ${produto}`);

          // 3. Se Zapier foi bem-sucedido, criar solicitação no banco (status em aberto)
          const solicitacao: SolicitacaoCarta = {
            cnpj: currentUser.cnpj,
            banco_id: selectedBank.codigo,
            produtos: produto, // Apenas o produto como string
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

          const response = await solicitacaoService.create(solicitacao);
          solicitacoesCriadas++;
          console.log(`✅ Solicitação criada para ${produto}:`, response.id);

          // 4. Enviar email com PDF anexado (opcional - pode ser feito pelo admin)
          const emailResult = await solicitacaoService.sendCartasEmail(response.id);
          if (emailResult.success) {
            emailsEnviados++;
            console.log(`✅ Email enviado para ${produto}`);
          } else {
            console.warn(`⚠️ Falha no email para ${produto}:`, emailResult.message);
          }

          // 5. Solicitação criada com status em_aberto - aprovação será feita pelo painel admin
          console.log(`✅ Solicitação criada com status em_aberto para ${produto}`);

          resultados.push({
            produto,
            success: true,
            solicitacaoId: response.id,
            zapierSuccess: true,
            emailSuccess: emailResult.success
          });

        } catch (error: any) {
          console.error(`❌ Erro ao processar produto ${produto}:`, error);
          resultados.push({
            produto,
            success: false,
            error: error.message
          });
        }
      }

      // Verificar se pelo menos uma solicitação foi processada com sucesso
      const sucessos = resultados.filter(r => r.success);
      if (sucessos.length === 0) {
        throw new Error('Nenhuma solicitação foi processada com sucesso');
      }

      // Preparar mensagem de sucesso
      const mensagem = [
        `🎉 Processamento concluído com sucesso!`,
        ``,
        `📊 Resumo:`,
        `• ${integracoesZapier} integração(ões) Zapier realizada(s)`,
        `• ${solicitacoesCriadas} solicitação(ões) criada(s) com status em_aberto`,
        `• ${emailsEnviados} email(s) enviado(s)`,
        `• ${sucessos.length} de ${selectedProducts.length} produto(s) processado(s) com sucesso`,
        ``,
        `📝 Próximos passos:`,
        `As solicitações serão revisadas e aprovadas pelo painel administrativo.`,
        `Você receberá uma confirmação quando as cartas forem aprovadas.`
      ].join('\n');

      setSuccess(mensagem);
      
      // Não redirecionar automaticamente - usuário decide quando sair
      // setTimeout(() => {
      //   navigate('/menu');
      // }, 5000);
      
    } catch (err: any) {
      console.error('❌ Erro ao processar solicitações:', err);
      setError(err.message || 'Erro ao processar solicitações');
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center',
              mb: 4,
              position: 'relative',
              gap: isMobile ? 1 : 0,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'flex-start' }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  minWidth: 140,
                  height: 40,
                  mb: isMobile ? 1 : 0,
                  mr: isMobile ? 0 : 2,
                  alignSelf: isMobile ? 'flex-start' : 'center',
                }}
                onClick={() => {
                  const hasProgresso = !!selectedBank || selectedProducts.length > 0 || Object.keys(formData).length > 0;
                  if (hasProgresso) {
                    setOpenConfirm(true);
                  } else {
                    navigate('/menu');
                  }
                }}
                startIcon={<KeyboardArrowLeft />}
              >
                Voltar ao menu
              </Button>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography 
                variant={isMobile ? 'h5' : 'h4'} 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  textAlign: 'center',
                }}
              >
                Geração de Carta VAN
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Preencha os dados para criar uma nova solicitação de carta
              </Typography>
            </Box>
          </Box>

          {/* Modal de confirmação */}
          <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
            <DialogTitle>Deseja voltar ao menu?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Se você voltar agora, todo o progresso do preenchimento será <b>perdido</b>.<br/>
                Tem certeza que deseja sair do assistente de geração de carta?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirm(false)} color="inherit">
                Cancelar
              </Button>
              <Button onClick={() => { setOpenConfirm(false); navigate('/menu'); }} color="primary" variant="contained" autoFocus>
                Sim, voltar
              </Button>
            </DialogActions>
          </Dialog>

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
          </Box>
        </Container>
      </Box>

      {/* Modal de sucesso */}
      <Dialog 
        open={!!success} 
        onClose={() => setSuccess('')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: theme.palette.success.main 
        }}>
          <CheckCircleIcon color="success" />
          Processamento Concluído!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
            {success}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccess('')} color="inherit">
            Fechar
          </Button>
          <Button 
            onClick={() => {
              setSuccess('');
              navigate('/menu');
            }} 
            variant="contained" 
            color="primary"
          >
            Voltar ao Menu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para erros */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WizardCartaVan;