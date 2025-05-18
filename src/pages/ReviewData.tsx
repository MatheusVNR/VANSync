// ReviewData.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import { useVan } from '../contexts/VanContext';

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

const StyledContent = styled(Box)`
  margin-left: 300px;
  padding: 24px;
`;

interface StepButtonProps {
  active?: boolean;
}


const StepButton = styled(Box)<StepButtonProps>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: ${({ active }) => (active ? '#003f71' : '#f5f5f5')};
  color: ${({ active }) => (active ? '#ffffff' : '#333')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  opacity: ${({ active }) => (active === false ? 0.6 : 1)};
  pointer-events: ${({ active }) => (active === false ? 'none' : 'auto')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? '#003f71' : '#e0e0e0')};
  }
`;

const StyledPDFCard = styled(Card)`
  padding: 32px;
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid #ccc;
  box-shadow: none;
`;


function ReviewData(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData } = useVan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backupData = useMemo(() => {
    try {
      const savedData = localStorage.getItem('companyData');
      return savedData ? JSON.parse(savedData) : null;
    } catch {
      return null;
    }
  }, []);

  const formattedData = useMemo(() => {
    const company = vanData.companyData || backupData || {};
    const bank = vanData.selectedBank;

    return {
      empresa: {
        nome: company.razaoSocial || '[NOME DA EMPRESA]',
        cnpj: company.cnpj || '[CNPJ DA EMPRESA]',
      },
      responsavel: {
        nome: company.responsavelNome || '[NOME DO RESPONSÁVEL DA EMPRESA]',
        email: company.responsavelEmail || '[E-MAIL DO RESPONSÁVEL DA EMPRESA]',
        telefone: company.responsavelTelefone || '[TELEFONE DO RESPONSÁVEL DA EMPRESA]',
      },
      conta: {
        banco: bank?.name || '[NOME DO BANCO]',
        agencia: company.agencia || '[AGÊNCIA]',
        conta: company.conta || '[CONTA]',
        dv: company.dv || '[DV]',
        cnab: company.cnab || '[CNAB]',
        convenio: company.convenio || '[CONVÊNIO]',
      },
      gerente: {
        nome: company.gerenteConta || '[NOME GERENTE]',
        email: company.gerenteEmail || '[E-MAIL GERENTE]',
        telefone: company.gerenteTelefone || '[TELEFONE GERENTE]',
      },
    };
  }, [vanData, backupData]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyData = vanData.companyData || backupData;
      if (!companyData) {
        setError('Dados do formulário não encontrados');
        return;
      }

      localStorage.setItem('companyData', JSON.stringify(companyData));
      navigate('/success');
    } catch {
      setError('Ocorreu um erro ao processar os dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          height: '64px',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <img src="/tecno_branca.png" alt="Tecnospeed" style={{ height: '30px' }} />
      </Box>

      {/* Sidebar */}
    <StyledSidebar elevation={1}>
            <StepButton active={false} onClick={() => navigate('/bank-selection')}>
              <Typography variant="subtitle1" fontWeight="bold">
                Instituição bancária
              </Typography>
              <Typography variant="body2">Selecione uma instituição</Typography>
            </StepButton>
    
            <StepButton active={false} onClick={() => navigate('/product-selection')}>
              <Typography variant="subtitle1" fontWeight="bold">
                Produtos
              </Typography>
              <Typography variant="body2">Selecione um ou mais produtos</Typography>
            </StepButton>
    
            <StepButton active={false}>
              <Typography variant="subtitle1" fontWeight="bold">
                Preenchimento de dados
              </Typography>
              <Typography variant="body2">Preencha os dados solicitados</Typography>
            </StepButton>
    
            <StepButton active={false}>
              <Typography variant="subtitle1" fontWeight="bold">
                Conferir e validar
              </Typography>
              <Typography variant="body2">Confirme os dados antes de enviar</Typography>
            </StepButton>
          </StyledSidebar>
    

      {/* Conteúdo Principal */}
      <StyledContent>
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            4. Conferir e validar informações da carta: Finnet
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Confira as informações abaixo. Se estiver tudo correto, finalize.
          </Typography>

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          <StyledPDFCard>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Boletos
              </Typography>

              <Typography paragraph>Ao BANCO {formattedData.conta.banco}</Typography>
              <Typography paragraph>A/C {formattedData.gerente.nome}</Typography>
              <Typography paragraph>Assunto: Intercâmbio de Arquivos – {formattedData.empresa.nome}</Typography>

              <Typography paragraph>
                Comunicamos que nossa empresa passou a operar no relacionamento da EDI, transferência eletrônica de arquivos, através da VAN FINNET.
              </Typography>
              <Typography paragraph>
                Solicitamos que esta Instituição disponibilize o suporte necessário para viabilizar esta implantação.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Contratante:</strong></Typography>
              <Typography variant="body2">Razão Social: {formattedData.empresa.nome}</Typography>
              <Typography variant="body2">CNPJ: {formattedData.empresa.cnpj}</Typography>
              <Typography variant="body2">
                Agência / Conta Corrente: {formattedData.conta.agencia} / {formattedData.conta.conta} - DV: {formattedData.conta.dv}
              </Typography>
              <Typography variant="body2">Convênio: {formattedData.conta.convenio}</Typography>
              <Typography variant="body2">CNAB: {formattedData.conta.cnab}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Van Contratada:</strong></Typography>
              <Typography variant="body2">Razão Social: FINNET S/A Tecnologia</Typography>
              <Typography variant="body2">CNPJ: 03.607.206/0001-10</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Contato da Empresa:</strong></Typography>
              <Typography variant="body2">Nome: {formattedData.responsavel.nome}</Typography>
              <Typography variant="body2">E-mail: {formattedData.responsavel.email}</Typography>
              <Typography variant="body2">Telefone: {formattedData.responsavel.telefone}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Contato da VAN FINNET:</strong></Typography>
              <Typography variant="body2">Nome: Suporte FINNET</Typography>
              <Typography variant="body2">E-mail: pti@finnet.com.br</Typography>
              <Typography variant="body2">Telefone: (11) 94457-5493 / (11) 99189-2213</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Responsável Técnico:</strong></Typography>
              <Typography variant="body2">Nome: [VARIÁVEL-NOME RESPONSÁVEL TECNOSPEED]</Typography>
              <Typography variant="body2">E-mail: [VARIÁVEL-E-MAIL RESPONSÁVEL TECNOSPEED]</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2"><strong>Gerente da Conta:</strong></Typography>
              <Typography variant="body2">Nome: {formattedData.gerente.nome}</Typography>
              <Typography variant="body2">E-mail: {formattedData.gerente.email}</Typography>
              <Typography variant="body2">Telefone: {formattedData.gerente.telefone}</Typography>

              <Typography sx={{ mt: 3 }}>
                Colocamo-nos à disposição para quaisquer esclarecimentos adicionais.
              </Typography>
              <Typography sx={{ mt: 1 }}>Atenciosamente,</Typography>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Divider sx={{ width: '200px', mx: 'auto' }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Assinatura do Responsável pela empresa
                </Typography>
              </Box>
            </CardContent>
          </StyledPDFCard>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/company-data')} disabled={loading}>
              Voltar
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                  Processando...
                </Box>
              ) : (
                'Confirmar e Enviar Carta'
              )}
            </Button>
          </Box>
        </Container>
      </StyledContent>
    </Box>
  );
}

export default ReviewData;
