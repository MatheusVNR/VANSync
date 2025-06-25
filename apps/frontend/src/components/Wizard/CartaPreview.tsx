import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BankIcon,
  Description as ProductIcon,
  Person as PersonIcon,
  AccountBalance as AccountIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import BackButton from '../BackButton';
import PDFViewer from './PDFViewer';
import { solicitacaoService } from '../../services/solicitacaoService';

interface CartaPreviewProps {
  produtos: string[];
  formData: any;
  selectedBank: any;
  fornecedorVan?: string; // Novo campo para seleção de fornecedor
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
  pdfBase64?: string;
}

const CartaPreview: React.FC<CartaPreviewProps> = ({ 
  produtos, 
  formData, 
  selectedBank, 
  fornecedorVan = 'nexxera', // Default para Nexxera
  onConfirm, 
  onBack, 
  loading 
}) => {
  const [currentCartaIndex, setCurrentCartaIndex] = useState(0);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [generatingCartas, setGeneratingCartas] = useState(true);
  const [error, setError] = useState<string>('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Gerar cartas com PDFs reais do backend
  useEffect(() => {
    const generateCartasComPDFs = async () => {
      if (!produtos.length || !formData || !selectedBank) {
        setGeneratingCartas(false);
        return;
      }

      try {
        setGeneratingCartas(true);
        setError('');

        // Preparar dados para o backend
        const previewData = {
          banco_id: selectedBank.codigo,
          produtos: produtos,
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
            cnpj_software_house: formData.cnpjSoftwareHouse,
            // Dados específicos para Nexxera
            cidade: formData.cidade || '',
            estado: formData.estado || '',
            preferencia_contato_gerente: formData.preferencia_contato_gerente || 'Email'
          },
          fornecedor_van: fornecedorVan
        };

        // Chamar o backend para gerar PDFs
        const responseData = await solicitacaoService.generatePreviewPDFs(previewData);
        
        if (responseData.success && responseData.pdfs) {
          const cartasComPDFs = responseData.pdfs.map((pdfData, index) => ({
            id: `carta-${index}`,
            produto: pdfData.produto,
            titulo: pdfData.titulo,
            numero: index + 1,
            conteudo: generateCartaContent(pdfData.produto, formData, selectedBank),
            pdfBase64: pdfData.pdfBase64,
          }));
          
          setCartas(cartasComPDFs);
        } else {
          throw new Error(responseData.message || 'Erro ao gerar PDFs');
        }
      } catch (err: any) {
        console.error('Erro ao gerar PDFs:', err);
        setError(err.message || 'Erro ao gerar PDFs das cartas');
        
        // Fallback: gerar cartas sem PDF
        const cartasFallback = produtos.map((produto, index) => ({
          id: `carta-${index}`,
          produto,
          titulo: `Carta de Solicitação - ${produto}`,
          numero: index + 1,
          conteudo: generateCartaContent(produto, formData, selectedBank),
        }));
        
        setCartas(cartasFallback);
      } finally {
        setGeneratingCartas(false);
      }
    };

    generateCartasComPDFs();
  }, [produtos, formData, selectedBank, fornecedorVan]);

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
        month: 'long',
        year: 'numeric'
      });
    };

    // Verificar se é Nexxera para incluir campos específicos
    const isNexxera = fornecedorVan?.toLowerCase() === 'nexxera';
    const dadosNexxera = isNexxera ? `
DADOS ADICIONAIS (Nexxera):
• Cidade: ${formData.cidade || 'N/A'}
• Estado (UF): ${formData.estado || 'N/A'}
• Preferência de Contato: ${formData.preferencia_contato_gerente || 'Email'}

` : '';

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

${dadosNexxera}SOFTWARE HOUSE: ${formData.cnpjSoftwareHouse ? formatCNPJ(formData.cnpjSoftwareHouse) : 'N/A'}

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

  if (generatingCartas) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        p: 4 
      }}>
        <Zoom in={true}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={60} 
              sx={{ 
                mb: 3,
                color: theme.palette.primary.main 
              }} 
            />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Gerando Cartas...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Preparando {produtos.length} carta{produtos.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Zoom>
      </Box>
    );
  }

  const currentCarta = cartas[currentCartaIndex];

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 3, px: 3 }}>
      {/* Header da Etapa */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2
          }}
        >
          Conferir e Validar
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Revise as informações das cartas antes de enviar as solicitações para o banco
        </Typography>
      </Box>

      {/* Erro */}
      {error && (
        <Fade in={true} timeout={800}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: 2
            }}
          >
            <Typography variant="body2">
              <strong>Erro:</strong> {error}
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Resumo dos dados */}
      <Fade in={true} timeout={800}>
        <Card sx={{ 
          mb: 4, 
          backgroundColor: theme.palette.grey[50],
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 3
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CheckIcon sx={{ color: theme.palette.success.main, mr: 2, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                Resumo da Solicitação
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BankIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Banco: {selectedBank.nome}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ProductIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Produtos: {produtos.join(', ')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ProductIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Fornecedor VAN: {fornecedorVan.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Responsável: {formData.nomeResponsavel}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Conta: {formData.agencia}-{formData.conta}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Visualização das Cartas com PDFViewer */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <PDFViewer
            title={currentCarta?.titulo || 'Carta de Solicitação'}
            subtitle={`${currentCarta?.produto} - ${selectedBank.nome} (${fornecedorVan.toUpperCase()})`}
            pdfBase64={currentCarta?.pdfBase64}
            onNext={handleNextCarta}
            onPrev={handlePrevCarta}
            hasMultiple={cartas.length > 1}
            currentIndex={currentCartaIndex}
            totalCount={cartas.length}
            loading={generatingCartas}
          />
        </Box>
      </Fade>

      {/* Alerta de Limite */}
      <Fade in={true} timeout={1200}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontWeight: 500
            }
          }}
        >
          <Typography variant="body2">
            <strong>Importante:</strong> O limite de cartas simultâneas por Software House é de 5 solicitações. 
            Acima disto é necessário aguardar a liberação das solicitações já abertas.
          </Typography>
        </Alert>
      </Fade>

      {/* Botões de Ação */}
      <Fade in={true} timeout={1400}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <BackButton 
            onClick={onBack}
            text="Voltar"
          />
          
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            onClick={onConfirm}
            disabled={loading || !currentCarta?.pdfBase64}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
              }
            }}
          >
            {loading ? 'Enviando...' : 'Confirmar e Enviar Cartas'}
          </Button>
        </Box>
      </Fade>
    </Box>
  );
};

export default CartaPreview;