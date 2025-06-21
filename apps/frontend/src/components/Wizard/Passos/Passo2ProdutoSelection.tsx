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
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  Description as ProductIcon,
} from '@mui/icons-material';

interface Passo2ProdutoSelectionProps {
  banco: any;
  selectedProducts?: string[];
  onBack: () => void;
  onNext: (produtos: string[]) => void;
}

const Passo2ProdutoSelection: React.FC<Passo2ProdutoSelectionProps> = ({
  banco,
  selectedProducts = [],
  onBack,
  onNext,
}) => {
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>(selectedProducts);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setSelectedProdutos(selectedProducts);
  }, [selectedProducts]);

  const handleProdutoToggle = (produto: string) => {
    setSelectedProdutos(prev => 
      prev.includes(produto)
        ? prev.filter(p => p !== produto)
        : [...prev, produto]
    );
  };

  const handleNext = () => {
    if (selectedProdutos.length > 0) {
      onNext(selectedProdutos);
    }
  };

  if (!banco) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Nenhum banco selecionado. Volte ao passo anterior.
        </Alert>
      </Box>
    );
  }

  // Tratar produtos como array JSON
  const produtos = Array.isArray(banco.produtos) 
    ? banco.produtos 
    : typeof banco.produtos === 'string' 
      ? JSON.parse(banco.produtos || '[]')
      : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Selecione os Produtos
      </Typography>

      {/* Informações do Banco */}
      <Card sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Banco: {banco.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Código: {banco.codigo.toString().padStart(3, '0')} • Padrão: {banco.padrao_van}
          </Typography>
        </CardContent>
      </Card>

      {/* Lista de Produtos em Cards */}
      {produtos.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.main }}>
            Produtos Disponíveis
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            }, 
            gap: 2 
          }}>
            {produtos.map((produto: string) => (
              <Card
                key={produto}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedProdutos.includes(produto)
                    ? `2px solid ${theme.palette.primary.main}`
                    : '2px solid transparent',
                  backgroundColor: selectedProdutos.includes(produto)
                    ? theme.palette.primary.light + '10'
                    : 'white',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main,
                  },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => handleProdutoToggle(produto)}
              >
                <CardContent sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  flex: 1,
                }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%',
                    backgroundColor: selectedProdutos.includes(produto)
                      ? theme.palette.primary.main
                      : theme.palette.grey[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                    transition: 'all 0.3s ease',
                  }}>
                    <ProductIcon 
                      sx={{ 
                        fontSize: 24,
                        color: selectedProdutos.includes(produto)
                          ? 'white'
                          : theme.palette.grey[600],
                      }} 
                    />
                  </Box>
                  
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 0.5,
                      color: selectedProdutos.includes(produto)
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }}
                  >
                    {produto}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    Produto disponível para este banco
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Nenhum produto disponível para este banco.
        </Alert>
      )}

      {/* Produtos Selecionados - Movido para baixo */}
      {selectedProdutos.length > 0 && (
        <Card sx={{ mb: 4, border: `2px solid ${theme.palette.success.main}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                Produtos Selecionados ({selectedProdutos.length})
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedProdutos.map((produto) => (
                <Chip
                  key={produto}
                  label={produto}
                  color="success"
                  variant="outlined"
                  onDelete={() => handleProdutoToggle(produto)}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Botões de Navegação */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        mt: 4,
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            minWidth: 120,
          }}
        >
          Voltar
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={selectedProdutos.length === 0}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            minWidth: 200,
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
          Próximo ({selectedProdutos.length} selecionado{selectedProdutos.length !== 1 ? 's' : ''})
        </Button>
      </Box>
    </Box>
  );
};

export default Passo2ProdutoSelection;