import React, { useState, useEffect } from 'react';
import { getBancos } from '../../services/bancoService';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';

export interface Banco {
  codigo: number;
  nome: string;
}

interface BancoSelectionProps {
  onNext: (bank: Banco) => void;
}

const BancoSelection: React.FC<BancoSelectionProps> = ({ onNext }) => {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [selectedBank, setSelectedBank] = useState<Banco | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchBancos = async () => {
      setLoading(true);
      try {
        const data = await getBancos();
        setBancos(data);
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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        1. Selecione um banco
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecione uma instituição bancária para criar uma nova carta de VAN
      </Typography>

      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
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
                    placeholder="Digite o código ou nome do banco..."
                  />
                )}
                filterOptions={(options, state) =>
                  options.filter(option =>
                    option.nome.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                    option.codigo.toString().includes(state.inputValue)
                  )
                }
                sx={{ mb: 4 }}
                noOptionsText="Nenhum banco encontrado"
                loading={loading}
              />

              {selectedBank && (
                <Box sx={{ mb: 4, p: 2, backgroundColor: theme.palette.primary.light + '10', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Banco selecionado:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedBank.codigo.toString().padStart(3, '0')} - {selectedBank.nome}
                  </Typography>
                </Box>
              )}

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 0
              }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedBank}
                  sx={{ 
                    minWidth: 200,
                    py: 1.5,
                  }}
                >
                  Próximo
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BancoSelection;