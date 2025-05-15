import React, { useState, useEffect, ChangeEvent } from 'react';
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
        <StepButton active variant="text" color="primary">
          1. Instituição bancária
        </StepButton>
        <StepButton variant="text" disabled>
          2. Produtos
        </StepButton>
        <StepButton variant="text" disabled>
          3. Preenchimento de dados
        </StepButton>
        <StepButton variant="text" disabled>
          4. Conferir e validar
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
              <MenuItem value="" disabled>
                Selecione um banco
              </MenuItem>
              {banks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.code} - {bank.name}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Voltar
              </Button>
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