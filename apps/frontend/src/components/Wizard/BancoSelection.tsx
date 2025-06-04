import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Container,
  Autocomplete,
  TextField
} from '@mui/material';

export interface Banco {
  codigo: number;
  nome: string;
}

interface BancoSelectionProps {
  onNext: (bank: Banco) => void;
}

const StyledContent = styled(Box)`
  margin-left: 300px;
  padding: 24px;
  background-color: #f5f5f5;
  
  @media (max-width: 960px) {
    margin-left: 0;
    padding-top: 100px; /* Espaço para a sidebar quando ela fica no topo */
  }

  @media (max-width: 600px) {
    padding: 16px;
    padding-top: 90px;
  }
`;

const BancoSelection: React.FC<BancoSelectionProps> = ({ onNext }) => {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [selectedBank, setSelectedBank] = useState<Banco | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchBancos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}banco`);
        setBancos(response.data);
      } catch (error) {
        setError('Erro ao carregar lista de bancos');
        console.error('Erro ao buscar bancos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBancos();
  }, []);

  const handleNext = () => {
    if (selectedBank) {
      onNext(selectedBank);
    }
  };

  return (
    <StyledContent>
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          1. Selecione um banco
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
            Selecione uma instituição bancária para criar uma nova carta de VAN
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ mt: 4 }}>
            <Autocomplete
              options={bancos}
              getOptionLabel={(option) => `${option.codigo.toString().padStart(3, '0')} - ${option.nome}`}
              value={selectedBank}
              onChange={(_, newValue) => setSelectedBank(newValue)}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Busque por código ou nome do banco" 
                  variant="outlined"
                  fullWidth
                />
              )}
              filterOptions={(options, state) =>
                options.filter(option =>
                  option.nome.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                  option.codigo.toString().includes(state.inputValue)
                )
              }
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedBank}
              >
                Próximo
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </StyledContent>
  );
};

export default BancoSelection;