import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { authService } from '../services/authService';

const MainMenu: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const menuItems = [
    {
      title: 'Nova Carta VAN',
      description: 'Criar uma nova solicitação de carta VAN',
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      onClick: () => navigate('/carta-van'),
      showFor: ['ADMIN', 'SH'],
    },
    {
      title: 'Cadastros',
      description: 'Gerenciar bancos e configurações',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      onClick: () => navigate('/cadastros'),
      showFor: ['ADMIN'],
    },
    // Botão de solicitações: nome e rota mudam conforme o tipo de usuário
    currentUser?.tipo === 'ADMIN'
      ? {
          title: 'Gerenciar solicitações',
          description: 'Visualizar e gerenciar todas as solicitações',
          icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
          color: theme.palette.success.main,
          onClick: () => navigate('/gerenciar-solicitacoes'),
          showFor: ['ADMIN'],
        }
      : {
          title: 'Minhas solicitações',
          description: 'Visualizar e gerenciar solicitações',
          icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
          color: theme.palette.success.main,
          onClick: () => navigate('/minhas-solicitacoes'),
          showFor: ['SH'],
        },
  ].filter(item => item.showFor.includes(currentUser?.tipo || ''));

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant={isMobile ? 'h3' : 'h2'} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              color: theme.palette.primary.main,
              letterSpacing: 1,
            }}
          >
            Olá! Seja bem-vindo ao VANSync
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Escolha uma das opções abaixo para começar
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Grid container spacing={6} justifyContent="center">
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `2px solid transparent`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: item.color,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                }}
                onClick={item.onClick}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: item.color + '15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default MainMenu;