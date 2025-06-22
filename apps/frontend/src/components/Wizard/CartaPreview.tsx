import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BankIcon,
  Description as ProductIcon,
  Person as PersonIcon,
  AccountBalance as AccountIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface CartaPreviewProps {
  produtos: string[];
  formData: any;
  selectedBank: any;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

interface Carta {
  id: string;
  produto: string;
  titulo: string;
  conteudo: string;
  numero: number;
}

const CartaPreview: React.FC<CartaPreviewProps> = ({ 
  produtos, 
  formData, 
  selectedBank, 
  onConfirm, 
  onBack, 
  loading 
}) => {
  const [currentCartaIndex, setCurrentCartaIndex] = useState(0);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [generatingCartas, setGeneratingCartas] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Gerar cartas baseadas nos produtos selecionados
  useEffect(() => {
    const generateCartas = () => {
      setGeneratingCartas(true);
      
      const cartasGeradas = produtos.map((produto, index) => ({
        id: `carta-${index}`,
        produto,
        titulo: `Carta de Solicitação - ${produto}`,
        numero: index + 1,
        conteudo: generateCartaContent(produto, formData, selectedBank),
      }));
      
      setCartas(cartasGeradas);
      setGeneratingCartas(false);
    };

    if (produtos.length > 0 && formData && selectedBank) {
      generateCartas();
    }
  }, [produtos, formData, selectedBank]);

  const generateCartaContent = (produto: string, formData: any, selectedBank: any) => {
    const formatCNPJ = (cnpj: string) => {
      return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const formatPhone = (phone: string) => {
      return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    };

    const formatDate = () => {
      return new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // Layout profissional baseado no padrão VAN
    return `
${selectedBank.nome.toUpperCase()}
${selectedBank.codigo.toString().padStart(3, '0')} - ${selectedBank.padrao_van.toUpperCase()}

${'='.repeat(80)}

À Gerência de Operações
${selectedBank.nome}
${selectedBank.padrao_van.toUpperCase()}

Assunto: Solicitação de Transmissão Automática - ${produto.toUpperCase()}

${formatDate()}

Prezados Senhores,

A ${formData.razaoSocial.toUpperCase()}, inscrita no CNPJ sob o nº ${formatCNPJ(formData.cnpjEmitente)}, 
representada por ${formData.nomeResponsavel.toUpperCase()}, no cargo de ${formData.cargoResponsavel}, 
vem solicitar a autorização para transmissão automática do produto ${produto.toUpperCase()}.

DADOS DA CONTA:
• Agência: ${formData.agencia}${formData.agenciaDV ? `-${formData.agenciaDV}` : ''}
• Conta: ${formData.conta}-${formData.contaDV}
• Convênio: ${formData.convenio}
• CNAB: ${formData.cnab}

DADOS DO RESPONSÁVEL:
• Nome: ${formData.nomeResponsavel.toUpperCase()}
• Cargo: ${formData.cargoResponsavel}
• Telefone: ${formatPhone(formData.telefone)}
• E-mail: ${formData.email}

DADOS DO GERENTE:
• Nome: ${formData.nomeGerente.toUpperCase()}
• Telefone: ${formatPhone(formData.telefoneGerente)}
• E-mail: ${formData.emailGerente}

SOFTWARE HOUSE: ${formData.cnpjSoftwareHouse ? formatCNPJ(formData.cnpjSoftwareHouse) : 'N/A'}

${'='.repeat(80)}

Atenciosamente,

${formData.nomeResponsavel.toUpperCase()}
${formData.cargoResponsavel}
${formData.razaoSocial.toUpperCase()}
CNPJ: ${formatCNPJ(formData.cnpjEmitente)}

${'='.repeat(80)}
    `;
  };

  const handleNextCarta = () => {
    setCurrentCartaIndex((prev) => (prev + 1) % cartas.length);
  };

  const handlePrevCarta = () => {
    setCurrentCartaIndex((prev) => (prev - 1 + cartas.length) % cartas.length);
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  if (generatingCartas) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Gerando Cartas...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preparando {produtos.length} carta{produtos.length > 1 ? 's' : ''} para visualização
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        4. Conferir e validar
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Revise as cartas antes de enviar as solicitações
      </Typography>

      {/* Resumo dos dados */}
      <Card sx={{ mb: 4, backgroundColor: theme.palette.grey[50] }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BankIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedBank?.codigo?.toString().padStart(3, '0')} - {selectedBank?.nome}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {produtos.map((produto, index) => (
              <Chip
                key={index}
                label={produto}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            <strong>{cartas.length} carta{cartas.length > 1 ? 's' : ''}</strong> serão enviadas por e-mail e integradas via Zapier
          </Typography>
        </CardContent>
      </Card>

      {/* Carrossel de Cartas */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          {/* Header do Carrossel */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PdfIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Carta {currentCartaIndex + 1} de {cartas.length}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handlePrevCarta}
                disabled={currentCartaIndex === 0}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:disabled': { color: theme.palette.grey[400] }
                }}
              >
                <PrevIcon />
              </IconButton>
              
              <Typography variant="body2" color="text.secondary">
                {cartas[currentCartaIndex]?.produto}
              </Typography>
              
              <IconButton
                onClick={handleNextCarta}
                disabled={currentCartaIndex === cartas.length - 1}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:disabled': { color: theme.palette.grey[400] }
                }}
              >
                <NextIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Indicador de Progresso */}
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={currentCartaIndex} alternativeLabel>
              {cartas.map((carta, index) => (
                <Step key={carta.id}>
                  <StepLabel>{carta.produto}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Preview da Carta */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              backgroundColor: 'white',
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 2,
              minHeight: 400,
              maxHeight: 500,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {cartas[currentCartaIndex]?.conteudo}
          </Paper>
        </CardContent>
      </Card>

      {/* Aviso importante */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon />
          <Typography variant="body2">
            <strong>Processo de Envio:</strong> Cada carta será enviada por e-mail e um ticket será aberto via Zapier automaticamente.
          </Typography>
        </Box>
      </Alert>

      {/* Botões de ação */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 4,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Voltar
        </Button>
        
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{ 
            minWidth: 200,
            py: 1.5,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {loading ? 'Enviando Cartas...' : `Enviar ${cartas.length} Carta${cartas.length > 1 ? 's' : ''}`}
        </Button>
      </Box>
    </Box>
  );
};

export default CartaPreview;