import React from 'react';
import { Button, IconButton, useTheme } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface BackButtonProps {
  onClick: () => void;
  variant?: 'button' | 'icon';
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  variant = 'button', 
  text = 'Voltar',
  size = 'medium'
}) => {
  const theme = useTheme();

  if (variant === 'icon') {
    return (
      <IconButton
        onClick={onClick}
        size={size}
        sx={{
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.light + '20',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    );
  }

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={onClick}
      size={size}
      sx={{ 
        borderRadius: 2,
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover': {
          borderColor: theme.palette.primary.dark,
          backgroundColor: theme.palette.primary.light + '10',
        },
      }}
    >
      {text}
    </Button>
  );
};

export default BackButton; 