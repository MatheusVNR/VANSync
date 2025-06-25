import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{
      width: '100%',
      py: 2,
      mt: 4,
      backgroundColor: 'background.paper',
      borderTop: '1px solid',
      borderColor: 'divider',
      textAlign: 'center',
    }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} VANSync. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer; 