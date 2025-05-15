import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import { useVan } from '../contexts/VanContext';
import { apiService } from '../services/api.service';

const StyledContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #1976D2 30%, #0D47A1 90%);
`;

const StyledCard = styled(Card)`
  text-align: center;
  padding: 32px;
  max-width: 500px;
  width: 100%;
`;

function Success(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData, resetVanData } = useVan();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string>('#456981');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Se não tiver dados da empresa, volta para o início
    if (!vanData.companyData && !localStorage.getItem('companyData')) {
      navigate('/');
      return;
    }

    const submitFormData = async () => {
      try {
        setIsGeneratingPdf(true);
        setPdfError(null);
        
        // Obter dados da empresa do contexto ou do localStorage
        const companyData = vanData.companyData || JSON.parse(localStorage.getItem('companyData') || '{}');
        
        // Enviar dados para o backend
        const response = await apiService.submitForm(companyData);
        
        if (response.success) {
          // Atualizar informações do ticket e URL do PDF
          if (response.ticketNumber) {
            setTicketNumber(response.ticketNumber);
          }
          
          if (response.pdfUrl) {
            setPdfUrl(response.pdfUrl);
          }
          
          // Simulação de download automático
          if (response.ticketNumber) {
            await downloadPdf(response.ticketNumber);
          }
        } else {
          setPdfError(response.message || 'Erro ao processar o formulário');
        }
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        setPdfError('Ocorreu um erro ao processar o formulário');
      } finally {
        setIsGeneratingPdf(false);
      }
    };
    
    // Chamar a função de envio
    submitFormData();
  }, [vanData, navigate]);

  const downloadPdf = async (ticketNum: string) => {
    try {
      setIsGeneratingPdf(true);
      const pdfBlob = await apiService.downloadPdf(ticketNum);
      
      // Criar URL temporária para o blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Criar elemento para download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `carta_van_${ticketNum.replace('#', '')}.pdf`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setPdfUrl(apiService.getPdfUrl(ticketNum));
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      setPdfError('Não foi possível baixar o PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleReset = (): void => {
    try {
      // Limpar o localStorage ao reiniciar
      localStorage.removeItem('companyData');
      resetVanData();
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
    }
    // Usar navegação direta por segurança
    window.location.href = '/';
  };

  return (
    <StyledContainer>
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Parabéns! Sua carta de VAN foi criada com sucesso.
          </Typography>
          
          {isGeneratingPdf && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {pdfError && (
            <Alert severity="error" sx={{ my: 2 }}>
              {pdfError}
            </Alert>
          )}
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Você receberá suas cartas em anexo via e-mail juntamente com o link do atendimento para acompanhar a abertura do relacionamento com o banco selecionado.
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Se houver qualquer dúvida, acesse nosso chat aqui.
          </Typography>

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h6" color="primary">
              {ticketNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Link de acesso: https://www.zendesk.com.br/tecnospeed/{ticketNumber.replace('#', '')}
            </Typography>
          </Box>

          {pdfUrl && (
            <Box sx={{ my: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => downloadPdf(ticketNumber)}
                disabled={isGeneratingPdf}
              >
                Baixar PDF Novamente
              </Button>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleReset}
            fullWidth
          >
            Início
          </Button>
        </CardContent>
      </StyledCard>
    </StyledContainer>
  );
}

export default Success; 