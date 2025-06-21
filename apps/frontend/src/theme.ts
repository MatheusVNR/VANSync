import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0353B3', // Azul 1 Tecnospeed
      light: '#18A3E0', // Azul 2 Tecnospeed
      dark: '#0F1827', // Azul 3 Tecnospeed
    },
    secondary: {
      main: '#18A3E0', // Azul 2 Tecnospeed
    },
    background: {
      default: '#FFFFFF', // Branco Tecnospeed
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F1827',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Nunito", "Visby Round CF", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(3, 83, 179, 0.3)',
          },
        },
        contained: {
          backgroundColor: '#0353B3',
          '&:hover': {
            backgroundColor: '#0F1827',
          },
        },
        outlined: {
          borderColor: '#0353B3',
          color: '#0353B3',
          '&:hover': {
            backgroundColor: 'rgba(3, 83, 179, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#18A3E0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0353B3',
            },
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: '#0353B3',
          },
          '&.Mui-active': {
            color: '#0353B3',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: '#0353B3',
          },
          '&.Mui-active': {
            color: '#0353B3',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme; 