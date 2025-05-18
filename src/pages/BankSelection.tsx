import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Paper,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import styled from 'styled-components';
import { bankService } from '../services/bank.service';
import { useVan } from '../contexts/VanContext';
import { Bank } from '../services/mock.service';

interface StepButtonProps {
  active?: boolean;
}

// Estilo da sidebar responsiva
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
  z-index: 1100; /* Garante que a sidebar fique acima do conteúdo em telas menores */

  @media (max-width: 960px) {
    width: 100%;
    position: static;
    height: auto;
    border-bottom: 1px solid #ddd;
  }
`;

// Estilo do conteúdo principal responsivo
const StyledContent = styled(Box)`
  margin-left: 300px;
  padding: 24px;

  @media (max-width: 960px) {
    margin-left: 0;
    padding-top: 100px; /* Espaço para a sidebar quando ela fica no topo */
  }

  @media (max-width: 600px) {
    padding: 16px;
    padding-top: 90px;
  }
`;

// Estilo dos botões de etapa responsivos
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

  @media (max-width: 960px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

function BankSelection(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData, updateVanData } = useVan();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async (): Promise<void> => {
    try {
      const data = await bankService.getBanks();
      setBanks(data);
    } catch (err) {
      setError('Erro ao carregar a lista de bancos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBankChange = (event: SelectChangeEvent<string>): void => {
    const selectedBank = banks.find(bank => bank.id === event.target.value);
    if (selectedBank) {
      updateVanData({ selectedBank });
    }
  };

  const handleNext = (): void => {
    if (vanData.selectedBank) {
      navigate('/product-selection');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        <StepButton active>
          <Typography variant="subtitle1" fontWeight="bold">
            Instituição bancária
          </Typography>
          <Typography variant="body2">
            Selecione uma instituição
          </Typography>
        </StepButton>

        <StepButton active={false}>
          <Typography variant="subtitle1" fontWeight="bold">
            Produtos
          </Typography>
          <Typography variant="body2">
            Selecione um ou mais produtos
          </Typography>
        </StepButton>

        <StepButton active={false}>
          <Typography variant="subtitle1" fontWeight="bold">
            Preenchimento de dados
          </Typography>
          <Typography variant="body2">
            Selecione um ou mais produtos
          </Typography>
        </StepButton>

        <StepButton active={false}>
          <Typography variant="subtitle1" fontWeight="bold">
            Conferir e validar
          </Typography>
          <Typography variant="body2">
            Confirme os dados antes de enviar
          </Typography>
        </StepButton>
      </StyledSidebar>

      {/* Main Content */}
      <StyledContent>
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            1. Selecionar um Banco (Instituição Bancária)
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Selecione um banco para criar uma nova carta de VAN
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 4 }}>
            <Select
              value={vanData.selectedBank?.id || ''}
              onChange={handleBankChange}
              displayEmpty
              fullWidth
              sx={{ mb: 3 }}
            >
              {banks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.code} - {bank.name}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!vanData.selectedBank}
              >
                Próximo
              </Button>
            </Box>
          </Box>
        </Container>
      </StyledContent>
    </Box>
  );
}

export default BankSelection;