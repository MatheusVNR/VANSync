import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  Check as CheckIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  List as ListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getBancos } from '../../../services/bancoService';

interface Passo1BancoSelectionProps {
  selectedBank?: any;
  onNext: (banco: any) => void;
}

const Passo1BancoSelection: React.FC<Passo1BancoSelectionProps> = ({ 
  selectedBank, 
  onNext 
}) => {
  const [bancos, setBancos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedBanco, setSelectedBanco] = useState<any>(selectedBank);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        setLoading(true);
        const data = await getBancos();
        setBancos(data);
      } catch (err: any) {
        setError('Erro ao carregar bancos: ' + (err.message || 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchBancos();
  }, []);

  const handleBancoSelect = (banco: any) => {
    setSelectedBanco(banco);
  };

  const handleNext = () => {
    if (selectedBanco) {
      onNext(selectedBanco);
    }
  };

  // Função para formatar o nome do banco
  const formatBancoName = (banco: any) => {
    return `${banco.codigo.toString().padStart(3, '0')} - ${banco.nome}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Selecione uma Instituição Bancária
      </Typography>

      {/* Autocomplete de Seleção */}
      <Box sx={{ mb: 4 }}>
        <Autocomplete
          options={bancos}
          getOptionLabel={(option) => formatBancoName(option)}
          value={selectedBanco}
          onChange={(event, newValue) => {
            handleBancoSelect(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar instituição bancária"
              placeholder="Digite o nome ou código do banco..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <BusinessIcon sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 20 }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatBancoName(option)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Padrão: {option.padrao_van}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          filterOptions={(options, { inputValue }) => {
            const searchTerm = inputValue.toLowerCase();
            return options.filter((option) => 
              option.nome.toLowerCase().includes(searchTerm) ||
              option.codigo.toString().includes(searchTerm) ||
              formatBancoName(option).toLowerCase().includes(searchTerm)
            );
          }}
          noOptionsText="Nenhum banco encontrado"
          loading={loading}
          loadingText="Carregando bancos..."
          sx={{
            '& .MuiAutocomplete-paper': {
              maxHeight: 300,
              boxShadow: theme.shadows[4],
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Banco Selecionado - Informações Detalhadas */}
      {selectedBanco && (
        <Card sx={{ mb: 3, border: `2px solid ${theme.palette.primary.main}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Banco Selecionado: {selectedBanco.nome}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CodeIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Código: {selectedBanco.codigo.toString().padStart(3, '0')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BusinessIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Padrão VAN: {selectedBanco.padrao_van}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ListIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    CNABs Suportados:
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 2 }}>
                  {selectedBanco.cnab240 && (
                    <Chip label="CNAB 240" size="small" color="primary" variant="outlined" />
                  )}
                  {selectedBanco.cnab400 && (
                    <Chip label="CNAB 400" size="small" color="primary" variant="outlined" />
                  )}
                  {selectedBanco.cnab444 && (
                    <Chip label="CNAB 444" size="small" color="primary" variant="outlined" />
                  )}
                </Box>
              </Box>
            </Box>
            
            {selectedBanco.produtos && selectedBanco.produtos.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Produtos Disponíveis:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedBanco.produtos.map((produto: string, index: number) => (
                      <Chip 
                        key={index}
                        label={produto} 
                        size="small" 
                        variant="outlined"
                        sx={{ backgroundColor: theme.palette.grey[50] }}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Botão Próximo */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!selectedBanco}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default Passo1BancoSelection;