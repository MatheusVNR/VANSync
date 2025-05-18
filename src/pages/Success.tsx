import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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

const FullScreenBox = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/background.png'); /* Caminho para sua imagem */
  background-size: cover; /* Cobrir todo o fundo */
  background-position: center; /* Centralizar a imagem */
  background-repeat: no-repeat; /* Não repetir a imagem */
`;

const CenteredCard = styled(Card)`
  text-align: center;
  padding: 40px;
  max-width: 600px;
  width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

function Success(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData, resetVanData } = useVan();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string>('#456981');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!vanData.companyData && !localStorage.getItem('companyData')) {
      navigate('/');
      return;
    }

    const submitFormData = async () => {
      try {
        setIsGeneratingPdf(true);
        setPdfError(null);

        const companyData = vanData.companyData || JSON.parse(localStorage.getItem('companyData') || '{}');

        const response = await apiService.submitForm(companyData);

        if (response.success) {
          if (response.ticketNumber) {
            setTicketNumber(response.ticketNumber);
          }

          if (response.pdfUrl) {
            setPdfUrl(response.pdfUrl);
          }

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

    submitFormData();
  }, [vanData, navigate]);

  const downloadPdf = async (ticketNum: string) => {
    try {
      setIsGeneratingPdf(true);
      const pdfBlob = await apiService.downloadPdf(ticketNum);

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `carta_van_${ticketNum.replace('#', '')}.pdf`);
      document.body.appendChild(link);
      link.click();
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
      localStorage.removeItem('companyData');
      resetVanData();
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
    }
    window.location.href = '/';
  };

  return (
    <FullScreenBox>
      <CenteredCard>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
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

          <Typography variant="body2" color="text.secondary" paragraph>
            Você receberá suas cartas em anexo via e-mail juntamente com o link do atendimento para acompanhar a abertura do relacionamento com o banco selecionado.
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Se houver qualquer dúvida, acesse nosso chat aqui.
          </Typography>

          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" align="center">
              {ticketNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Link de acesso: https://www.zendesk.com.br/tecnospeed/{ticketNumber.replace('#', '')}
            </Typography>
          </Box>

          {pdfUrl && (
            <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
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
      </CenteredCard>
    </FullScreenBox>
  );
}

export default Success;