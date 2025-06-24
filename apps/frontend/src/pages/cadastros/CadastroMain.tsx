import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  useTheme, 
  useMediaQuery,
  Card,
  CardContent,
  CardActionArea,
  Fade,
  Chip,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import MainLayout from '../../components/MainLayout';
import CadastroBancos from './CadastroBancos';
import CadastroUsuarios from './CadastroUsuarios';

type ConfigSection = 'menu' | 'bancos' | 'usuarios';

const CadastroMain: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<ConfigSection>('menu');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const configOptions = [
    {
      id: 'bancos' as ConfigSection,
      title: 'Cadastro de Bancos',
      description: 'Gerencie os bancos e suas configurações VAN',
      icon: <BankIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
    },
    {
      id: 'usuarios' as ConfigSection,
      title: 'Usuários',
      description: 'Gerencie usuários e permissões do sistema',
      icon: <BusinessIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
    },
  ];

  const handleSectionClick = (section: ConfigSection) => {
    if (section === 'menu') {
      setCurrentSection('menu');
    } else {
      const option = configOptions.find(opt => opt.id === section);
      if (option) {
        setCurrentSection(section);
      }
    }
  };

  const renderMenu = () => (
    <Fade in={true} timeout={300}>
      <Box>
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
            Configurações
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            Gerencie as configurações e cadastros do sistema
          </Typography>
        </Box>

        {/* Grid de Opções */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(2, 1fr)' 
          },
          gap: 3,
          maxWidth: 'lg',
          mx: 'auto',
        }}>
          {configOptions.map((option) => (
            <Card 
              key={option.id}
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleSectionClick(option.id)}
                sx={{ 
                  height: '100%',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {option.icon}
                </Box>
                
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {option.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {option.description}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Fade>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'bancos':
        return <CadastroBancos />;
      case 'usuarios':
        return <CadastroUsuarios />;
      default:
        return renderMenu();
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        {currentSection !== 'menu' && (
          <Box sx={{ mb: 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer',
                color: theme.palette.primary.main,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={() => handleSectionClick('menu')}
            >
              <SettingsIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Configurações
              </Typography>
            </Box>
          </Box>
        )}

        {/* Conteúdo */}
        {renderSection()}
      </Container>
    </MainLayout>
  );
};

export default CadastroMain;