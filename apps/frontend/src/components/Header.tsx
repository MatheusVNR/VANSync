import React from 'react';
import { Box } from '@mui/material';

const Header: React.FC = () => {
  return (
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
          src="images/tecno_branca.png"
          alt="Tecnospeed"
          style={{ height: '30px' }}
        />
    </Box>
  );
};

export default Header;