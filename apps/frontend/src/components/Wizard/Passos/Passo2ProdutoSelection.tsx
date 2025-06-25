import React, { useState } from 'react';
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
  Description as ProductIcon,
} from '@mui/icons-material';
import BackButton from '../../BackButton';

interface Passo2ProdutoSelectionProps {
  bank: any;
  selectedProducts: string[];
  onProductToggle: (produto: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const Passo2ProdutoSelection: React.FC<Passo2ProdutoSelectionProps> = ({
  bank,
  selectedProducts,
  onProductToggle,
  onBack,
  onNext,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    if (selectedProducts.length > 0) {
      onNext();
    }
  };

  if (!bank) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Nenhum banco selecionado. Volte ao passo anterior.
        </Alert>
      </Box>
    );
  }

  // Tratar produtos como array JSON
  const produtos = Array.isArray(bank.produtos) 
    ? bank.produtos 
    : typeof bank.produtos === 'string' 
      ? JSON.parse(bank.produtos || '[]')
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
            Banco: {bank.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Código: {bank.codigo.toString().padStart(3, '0')} • Padrão: {bank.padrao_van}
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
                  border: selectedProducts.includes(produto)
                    ? `2px solid ${theme.palette.primary.main}`
                    : '2px solid transparent',
                  backgroundColor: selectedProducts.includes(produto)
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
                onClick={() => onProductToggle(produto)}
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
                    backgroundColor: selectedProducts.includes(produto)
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
                        color: selectedProducts.includes(produto)
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
                      color: selectedProducts.includes(produto)
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
      {selectedProducts.length > 0 && (
        <Card sx={{ mb: 4, border: `2px solid ${theme.palette.success.main}` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                Produtos Selecionados ({selectedProducts.length})
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedProducts.map((produto) => (
                <Chip
                  key={produto}
                  label={produto}
                  color="success"
                  variant="outlined"
                  onDelete={() => onProductToggle(produto)}
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
        <BackButton 
          onClick={onBack}
          text="Voltar"
        />

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={selectedProducts.length === 0}
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
          Próximo ({selectedProducts.length} selecionado{selectedProducts.length !== 1 ? 's' : ''})
        </Button>
      </Box>
    </Box>
  );
};

export default Passo2ProdutoSelection;