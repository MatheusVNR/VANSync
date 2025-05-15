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

const ProductCard = styled(Card)<ProductCardProps>`
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? '#1976D2' : 'transparent'};
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
`;

function ProductSelection(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData, updateVanData } = useVan();
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    vanData.selectedProducts?.map(p => p.id) || []
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

  const toggleProduct = (productId: string): void => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleNext = (): void => {
    if (selectedProducts.length > 0) {
      // Converter IDs selecionados para objetos de produtos
      const productsToSave: Product[] = products
        .filter(product => selectedProducts.includes(product.id))
        .map(product => ({
          id: product.id,
          name: product.title,
          description: product.description,
        }));
      
      updateVanData({ selectedProducts: productsToSave });
      navigate('/company-data');
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
        <StepButton active variant="text" color="primary">
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
            2. Selecionar um ou mais produtos
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Selecione quais produtos deseja utilizar a transferência de arquivos por VAN
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} key={product.id}>
                <ProductCard
                  selected={selectedProducts.includes(product.id)}
                  onClick={() => toggleProduct(product.id)}
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
            <Button
              variant="outlined"
              onClick={() => navigate('/bank-selection')}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={selectedProducts.length === 0}
            >
              Próximo
            </Button>
          </Box>
        </Container>
      </StyledContent>
    </Box>
  );
}

export default ProductSelection; 