import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { TECNOSPEED_COLORS } from '../constants/colors';

interface ToastProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          backgroundColor: severity === 'success' ? TECNOSPEED_COLORS.SUCESSO : 
                          severity === 'error' ? TECNOSPEED_COLORS.ERRO :
                          severity === 'warning' ? TECNOSPEED_COLORS.AVISO :
                          TECNOSPEED_COLORS.INFO,
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast; 