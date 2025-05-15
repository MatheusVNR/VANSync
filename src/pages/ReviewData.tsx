import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import { useVan } from '../contexts/VanContext';
import { apiService } from '../services/api.service';

interface StepButtonProps {
  active?: boolean;
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

const StyledSidebar = styled(Paper)`
  width: 250px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
`;

const StyledContent = styled(Box)`
  margin-left: 250px;
  padding: 24px;
`;

const StepButton = styled(Button)<StepButtonProps>`
  justify-content: flex-start;
  text-align: left;
  padding: 16px;
  background-color: ${props => props.active ? '#e3f2fd' : 'transparent'};
  &:hover {
    background-color: #e3f2fd;
  }
`;

const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom color="primary">
      {title}
    </Typography>
    {children}
  </Box>
);

function ReviewData(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData } = useVan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tentar carregar dados do localStorage como backup
  const backupData = React.useMemo(() => {
    try {
      const savedData = localStorage.getItem('companyData');
      return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
      return null;
    }
  }, []);

  // Usar dados reais do contexto ou do localStorage como backup
  const formattedData = React.useMemo(() => {
    // Se temos dados no contexto, use eles
    if (vanData.companyData) {
      return {
        empresa: {
          nome: vanData.companyData.razaoSocial || '[NOME DA EMPRESA]',
          cnpj: vanData.companyData.cnpj || '[CNPJ DA EMPRESA]',
        },
        responsavel: {
          nome: vanData.companyData.responsavelNome || '[NOME DO RESPONSÁVEL DA EMPRESA]',
          email: vanData.companyData.responsavelEmail || '[E-MAIL DO RESPONSÁVEL DA EMPRESA]',
          telefone: vanData.companyData.responsavelTelefone || '[TELEFONE DO RESPONSÁVEL DA EMPRESA]',
        },
        conta: {
          banco: vanData.selectedBank?.name || '[NOME DO BANCO]',
          agencia: vanData.companyData.agencia || '[AGÊNCIA DO BANCO]',
          conta: vanData.companyData.conta || '[CONTA DA EMPRESA]',
          convenio: vanData.companyData.convenio || '[CONVÊNIO DA EMPRESA]',
        },
        gerente: {
          nome: vanData.companyData.gerenteConta || '[NOME GERENTE DA CONTA]',
          email: vanData.companyData.gerenteEmail || '[E-MAIL GERENTE DA CONTA]',
          telefone: vanData.companyData.gerenteTelefone || '[TELEFONE GERENTE DA CONTA]',
        },
      };
    }
    // Se não, tente usar os dados do localStorage
    else if (backupData) {
      return {
        empresa: {
          nome: backupData.razaoSocial || '[NOME DA EMPRESA]',
          cnpj: backupData.cnpj || '[CNPJ DA EMPRESA]',
        },
        responsavel: {
          nome: backupData.responsavelNome || '[NOME DO RESPONSÁVEL DA EMPRESA]',
          email: backupData.responsavelEmail || '[E-MAIL DO RESPONSÁVEL DA EMPRESA]',
          telefone: backupData.responsavelTelefone || '[TELEFONE DO RESPONSÁVEL DA EMPRESA]',
        },
        conta: {
          banco: backupData.banco || '[NOME DO BANCO]',
          agencia: backupData.agencia || '[AGÊNCIA DO BANCO]',
          conta: backupData.conta || '[CONTA DA EMPRESA]',
          convenio: backupData.convenio || '[CONVÊNIO DA EMPRESA]',
        },
        gerente: {
          nome: backupData.gerenteConta || '[NOME GERENTE DA CONTA]',
          email: backupData.gerenteEmail || '[E-MAIL GERENTE DA CONTA]',
          telefone: backupData.gerenteTelefone || '[TELEFONE GERENTE DA CONTA]',
        },
      };
    }
    // Se nada disso funcionar, use valores padrão
    else {
      return {
        empresa: {
          nome: '[NOME DA EMPRESA]',
          cnpj: '[CNPJ DA EMPRESA]',
        },
        responsavel: {
          nome: '[NOME DO RESPONSÁVEL DA EMPRESA]',
          email: '[E-MAIL DO RESPONSÁVEL DA EMPRESA]',
          telefone: '[TELEFONE DO RESPONSÁVEL DA EMPRESA]',
        },
        conta: {
          banco: '[NOME DO BANCO]',
          agencia: '[AGÊNCIA DO BANCO]',
          conta: '[CONTA DA EMPRESA]',
          convenio: '[CONVÊNIO DA EMPRESA]',
        },
        gerente: {
          nome: '[NOME GERENTE DA CONTA]',
          email: '[E-MAIL GERENTE DA CONTA]',
          telefone: '[TELEFONE GERENTE DA CONTA]',
        },
      };
    }
  }, [vanData, backupData]);

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter dados do formulário
      const companyData = vanData.companyData || backupData;
      
      if (!companyData) {
        setError('Dados do formulário não encontrados');
        return;
      }
      
      // Salvar dados no localStorage para a página de sucesso
      localStorage.setItem('companyData', JSON.stringify(companyData));
      
      // Navegar para a página de sucesso (o envio será feito lá)
      navigate('/success');
    } catch (error) {
      console.error('Erro ao processar dados:', error);
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
        <img
          src="/tecno_branca.png"
          alt="Tecnospeed"
          style={{ height: '30px' }}
        />
      </Box>

      {/* Sidebar */}
      <StyledSidebar elevation={1}>
        <StepButton variant="text" color="primary">
          1. Instituição bancária
        </StepButton>
        <StepButton variant="text" color="primary">
          2. Produtos
        </StepButton>
        <StepButton variant="text" color="primary">
          3. Preenchimento de dados
        </StepButton>
        <StepButton active variant="text" color="primary">
          4. Conferir e validar
        </StepButton>
      </StyledSidebar>

      {/* Main Content */}
      <StyledContent>
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            4. Conferir e validar informações da carta
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Para finalizarmos, precisamos apenas que confira todas as informações presentes na carta abaixo. Se estiver tudo corretamente preenchido, então é só finalizar. Se precisar alterar alguma informação, basta voltar e repetir os processos anteriores.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Boletos
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" paragraph>
                  Ao BANCO {formattedData.conta.banco}
                </Typography>
                <Typography variant="body1" paragraph>
                  A/C {formattedData.gerente.nome}
                </Typography>
                <Typography variant="body1" paragraph>
                  Assunto: Intercâmbio de Arquivos – {formattedData.empresa.nome}
                </Typography>

                <Typography variant="body1" paragraph sx={{ mt: 3 }}>
                  Comunicamos que nossa empresa passou a operar no relacionamento da EDI, transferência eletrônica de arquivos, através da VAN FINNET.
                </Typography>
                <Typography variant="body1" paragraph>
                  Solicitamos que esta Instituição disponibilize o suporte necessário para viabilizar esta implantação, onde as ações necessárias para esta migração serão conduzidas juntamente com a FINNET.
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">Contratante:</Typography>
                  <Typography variant="body1">Razão Social: {formattedData.empresa.nome}</Typography>
                  <Typography variant="body1">CNPJ: {formattedData.empresa.cnpj}</Typography>
                  <Typography variant="body1">Agência / Conta Corrente: {formattedData.conta.agencia} / {formattedData.conta.conta}</Typography>
                  <Typography variant="body1">Convênio: {formattedData.conta.convenio}</Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">Van Contratada</Typography>
                  <Typography variant="body1">Razão Social: FINNET S/A Tecnologia</Typography>
                  <Typography variant="body1">CNPJ: 03.607.206/0001-10</Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">Contato da Empresa</Typography>
                  <Typography variant="body1">Nome: {formattedData.responsavel.nome}</Typography>
                  <Typography variant="body1">E-mail: {formattedData.responsavel.email}</Typography>
                  <Typography variant="body1">Telefone: {formattedData.responsavel.telefone}</Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">Contato da VAN FINNET</Typography>
                  <Typography variant="body1">Nome: Suporte FINNET</Typography>
                  <Typography variant="body1">E-mail: pti@finnet.com.br</Typography>
                  <Typography variant="body1">Telefone: (11) 94457-5493 (11) 99189-2213</Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">Contato do responsável técnico</Typography>
                  <Typography variant="body1">Nome: [VARIÁVEL-NOME RESPONSÁVEL TECNOSPEED]</Typography>
                  <Typography variant="body1">E-mail: [VARIÁVEL-E-MAIL RESPONSÁVEL TECNOSPEED]</Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1">Contato do gerente da conta</Typography>
                  <Typography variant="body1">Nome: {formattedData.gerente.nome}</Typography>
                  <Typography variant="body1">E-mail: {formattedData.gerente.email}</Typography>
                  <Typography variant="body1">Telefone: {formattedData.gerente.telefone}</Typography>
                </Box>

                <Typography variant="body1" sx={{ mt: 3 }}>
                  Colocamo-nos à disposição para quaisquer esclarecimentos adicionais.
                </Typography>

                <Typography variant="body1" sx={{ mt: 2 }}>
                  Atenciosamente,
                </Typography>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Divider sx={{ width: '200px', margin: '0 auto' }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Assinatura do Responsável pela empresa
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/company-data')}
              disabled={loading}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
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