import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

interface ProductSelectionProps {
  banco: { produtos: string[] };
  onProductsSelected: (products: string[]) => void;
  onBack: () => void;
}

const ProdutoSelection: React.FC<ProductSelectionProps> = ({ banco, onProductsSelected, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Tratar produtos como array JSON
  const produtosDisponiveis = Array.isArray(banco.produtos) 
    ? banco.produtos 
    : typeof banco.produtos === 'string' 
      ? JSON.parse(banco.produtos || '[]')
      : [];
      
  const [produtosSelecionados, setProdutosSelecionados] = useState<string[]>([]);

  const toggleProduct = (product: string) => {
    if (produtosSelecionados.includes(product)) {
      setProdutosSelecionados(produtosSelecionados.filter((p) => p !== product));
    } else {
      setProdutosSelecionados([...produtosSelecionados, product]);
    }
  };

  const handleNext = () => {
    if (produtosSelecionados.length > 0) {
      onProductsSelected(produtosSelecionados);
    } else {
      alert('Selecione ao menos um produto.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        2. Seleção de Produtos
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Selecione um ou mais produtos para a geração da carta
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {produtosDisponiveis.map((product: string) => (
              <Chip
                key={product}
                label={product}
                onClick={() => toggleProduct(product)}
                color={produtosSelecionados.includes(product) ? 'primary' : 'default'}
                variant={produtosSelecionados.includes(product) ? 'filled' : 'outlined'}
                icon={produtosSelecionados.includes(product) ? <CheckIcon /> : undefined}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: theme.shadows[2],
                  },
                }}
              />
            ))}
          </Box>

          {produtosSelecionados.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Produtos selecionados ({produtosSelecionados.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {produtosSelecionados.map((produto) => (
                  <Chip
                    key={produto}
                    label={produto}
                    color="primary"
                    size="small"
                    onDelete={() => toggleProduct(produto)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Botões de ação */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 0
          }}>
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{ minWidth: 120 }}
            >
              Voltar
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={produtosSelecionados.length === 0}
              sx={{ 
                minWidth: 200,
                py: 1.5,
              }}
            >
              Prosseguir
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProdutoSelection;