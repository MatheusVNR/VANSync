import React from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  Business as BankIcon,
  List as ProductIcon,
  Edit as FormIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';

interface WizardSideBarProps {
  currentStep: number;
  completedSteps: Set<number>;
}

const steps = [
  {
    label: 'Seleção de Banco',
    description: 'Escolha a instituição bancária',
    icon: BankIcon,
  },
  {
    label: 'Seleção de Produtos',
    description: 'Selecione os produtos desejados',
    icon: ProductIcon,
  },
  {
    label: 'Dados da Carta',
    description: 'Preencha as informações',
    icon: FormIcon,
  },
  {
    label: 'Conferir e Validar',
    description: 'Revise as cartas geradas',
    icon: PreviewIcon,
  },
];

const WizardSideBar: React.FC<WizardSideBarProps> = ({ currentStep, completedSteps }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return null; // Não mostrar sidebar em mobile
  }

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        left: 0,
        top: 64, // Altura do header
        width: 280,
        height: 'calc(100vh - 64px)',
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        zIndex: 1000,
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: 3,
            textAlign: 'center',
          }}
        >
          Progresso do Wizard
        </Typography>

        <Stepper
          orientation="vertical"
          activeStep={currentStep}
          sx={{
            '& .MuiStepConnector-line': {
              minHeight: 40,
            },
            '& .MuiStepLabel-root': {
              padding: 1,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
            '& .MuiStepLabel-root.Mui-active': {
              backgroundColor: theme.palette.primary.light + '20',
            },
            '& .MuiStepLabel-root.Mui-completed': {
              backgroundColor: theme.palette.success.light + '20',
            },
          }}
        >
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isActive = currentStep === index;
            const IconComponent = step.icon;

            return (
              <Step key={index} completed={isCompleted}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => {
                    if (completed) {
                      return (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.success.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 600,
                          }}
                        >
                          ✓
                        </Box>
                      );
                    }
                    if (active) {
                      return (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Box>
                      );
                    }
                    return (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: theme.palette.grey[300],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.palette.grey[600],
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {index + 1}
                      </Box>
                    );
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: isActive || isCompleted ? 600 : 400,
                        color: isActive
                          ? theme.palette.primary.main
                          : isCompleted
                          ? theme.palette.success.main
                          : theme.palette.text.primary,
                        mb: 0.5,
                      }}
                    >
                      {step.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.75rem',
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {/* Informações adicionais */}
        <Box sx={{ mt: 4, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
            Dica:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.palette.text.secondary }}>
            Revise cuidadosamente todas as informações antes de enviar as cartas para o banco.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WizardSideBar;