import React from 'react';
import { Container, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import CadastroBancos from './CadastroBancos';
import MainLayout from '../../components/MainLayout';

const CadastroMain: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant={isMobile ? 'h4' : 'h3'} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Cadastros
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            Gerencie os bancos e configurações do sistema
          </Typography>
        </Box>

        {/* Conteúdo */}
        <CadastroBancos />
      </Container>
    </MainLayout>
  );
};

export default CadastroMain;