import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { TECNOSPEED_COLORS } from '../constants/colors';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  open, 
  message = 'Carregando...' 
}) => {
  return (
    <Backdrop
      sx={{
        color: TECNOSPEED_COLORS.BRANCO,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(15, 24, 39, 0.8)',
        backdropFilter: 'blur(4px)'
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress 
          size={60}
          sx={{
            color: TECNOSPEED_COLORS.AZUL_2,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: TECNOSPEED_COLORS.BRANCO,
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay; 