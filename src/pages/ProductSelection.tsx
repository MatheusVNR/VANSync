import React, { useState } from 'react';
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
} from '@mui/material';
import styled from 'styled-components';
import { useVan } from '../contexts/VanContext';
import { Product } from '../services/mock.service';

interface StepButtonProps {
  active?: boolean;
}

interface ProductCardProps {
  selected: boolean;
}

interface ProductItem {
  id: string;
  title: string;
  description: string;
}

// Sidebar
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

// Conteúdo principal com margin-left igual à largura da sidebar
const StyledContent = styled(Box)`
  margin-left: 300px;
  padding: 24px;
`;

// Botão de passo estilizado
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

const ProductCard = styled(Card)<ProductCardProps>`
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${(props) => (props.selected ? '#1976D2' : 'transparent')};
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

function ProductSelection(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData, updateVanData } = useVan();
  const [selectedProduct, setSelectedProduct] = useState<string>(
    vanData.selectedProducts?.[0]?.id || ''
  );

  const products: ProductItem[] = [
    {
      id: 'boletos',
      title: 'Boletos',
      description: 'Trafegar arquivos de remessa e retorno de boletos',
    },
    {
      id: 'pagamentos',
      title: 'Pagamentos',
      description: 'Trafegar arquivos de remessa e retorno de pagamentos',
    },
    {
      id: 'extrato',
      title: 'Extrato',
      description: 'Trafegar arquivos de extrato',
    },
    {
      id: 'dda',
      title: 'DDA',
      description: 'Trafegar arquivos de remessa de débitos',
    },
  ];

  const selectProduct = (productId: string): void => {
    setSelectedProduct((prev) => (prev === productId ? '' : productId));
  };

  const handleNext = (): void => {
    if (selectedProduct) {
      const productToSave = products.find((p) => p.id === selectedProduct);
      if (productToSave) {
        updateVanData({
          selectedProducts: [
            {
              id: productToSave.id,
              name: productToSave.title,
            },
          ],
        });
        navigate('/company-data');
      }
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
        <StepButton active={false}>
          <Typography variant="subtitle1" fontWeight="bold">
            Instituição bancária
          </Typography>
          <Typography variant="body2">Selecione uma instituição</Typography>
        </StepButton>

        <StepButton active>
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

      {/* Main Content */}
      <StyledContent>
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            2. Selecionar um ou mais produtos
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Selecione quais produtos deseja utilizar a transferência de arquivos por VAN
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} key={product.id}>
                <ProductCard
                  selected={selectedProduct === product.id}
                  onClick={() => selectProduct(product.id)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </CardContent>
                </ProductCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate('/bank-selection')}>
              Voltar
            </Button>
            <Button variant="contained" onClick={handleNext} disabled={!selectedProduct}>
              Próximo
            </Button>
          </Box>
        </Container>
      </StyledContent>
    </Box>
  );
}

export default ProductSelection;
