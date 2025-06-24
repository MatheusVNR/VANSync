import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#0066CC', // Cor azul da Tecnospeed
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '0 !important',
        '&.MuiAppBar-root': {
          borderRadius: '0 !important',
        },
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
        {/* Logo Tecnospeed */}
        <Box sx={{ flexGrow: 0, mr: 3 }}>
          <img
            src="/images/tecno_branca.png"
            alt="Tecnospeed"
            style={{ 
              height: '32px',
              filter: 'brightness(0) invert(1)', // Garante que seja branco
            }}
          />
        </Box>

        {/* Informações do Usuário */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<BusinessIcon />}
            label={currentUser?.tipo === 'ADMIN' ? 'Administrador' : 'Software House'}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
          
          {!isMobile && (
            <>
              <Typography variant="body2" sx={{ mx: 1, color: 'rgba(255,255,255,0.8)' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                {currentUser?.nome_empresa}
              </Typography>
              <Typography variant="body2" sx={{ mx: 1, color: 'rgba(255,255,255,0.8)' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {formatCNPJ(currentUser?.cnpj || '')}
              </Typography>
            </>
          )}
        </Box>

        {/* Botão de Sair */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            minWidth: 'auto',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            borderColor: 'rgba(255,255,255,0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'white',
            },
          }}
        >
          {!isMobile && 'Sair'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;