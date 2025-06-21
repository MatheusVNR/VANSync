import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { TECNOSPEED_COLORS } from './constants/colors';

// Criar tema base
let theme = createTheme({
  palette: {
    primary: {
      main: TECNOSPEED_COLORS.AZUL_1,
      light: TECNOSPEED_COLORS.AZUL_2,
      dark: TECNOSPEED_COLORS.AZUL_3,
      contrastText: TECNOSPEED_COLORS.BRANCO,
    },
    secondary: {
      main: TECNOSPEED_COLORS.AZUL_2,
      light: '#4FC3F7',
      dark: '#0277BD',
      contrastText: TECNOSPEED_COLORS.BRANCO,
    },
    success: {
      main: TECNOSPEED_COLORS.SUCESSO,
      light: '#81C784',
      dark: '#388E3C',
    },
    error: {
      main: TECNOSPEED_COLORS.ERRO,
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: TECNOSPEED_COLORS.AVISO,
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: TECNOSPEED_COLORS.INFO,
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: TECNOSPEED_COLORS.FUNDO_AZUL_SUAVE,
      paper: TECNOSPEED_COLORS.FUNDO_CARD,
    },
    text: {
      primary: TECNOSPEED_COLORS.TEXTO_PRIMARIO,
      secondary: TECNOSPEED_COLORS.TEXTO_SECUNDARIO,
      disabled: TECNOSPEED_COLORS.TEXTO_DESABILITADO,
    },
    divider: TECNOSPEED_COLORS.BORDA_PRIMARIA,
  },
  typography: {
    fontFamily: '"Inter", "Nunito", "Visby Round CF", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: TECNOSPEED_COLORS.TEXTO_PRIMARIO,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: TECNOSPEED_COLORS.TEXTO_SECUNDARIO,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.875rem',
      letterSpacing: '0.025em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: TECNOSPEED_COLORS.TEXTO_SECUNDARIO,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          fontSize: '0.875rem',
          letterSpacing: '0.025em',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(3, 83, 179, 0.25)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            backgroundColor: TECNOSPEED_COLORS.CINZA_300,
            color: TECNOSPEED_COLORS.TEXTO_DESABILITADO,
          },
        },
        contained: {
          backgroundColor: TECNOSPEED_COLORS.AZUL_1,
          color: TECNOSPEED_COLORS.BRANCO,
          '&:hover': {
            backgroundColor: TECNOSPEED_COLORS.AZUL_3,
          },
        },
        outlined: {
          borderColor: TECNOSPEED_COLORS.AZUL_1,
          color: TECNOSPEED_COLORS.AZUL_1,
          borderWidth: '2px',
          '&:hover': {
            backgroundColor: 'rgba(3, 83, 179, 0.04)',
            borderColor: TECNOSPEED_COLORS.AZUL_3,
          },
        },
        text: {
          color: TECNOSPEED_COLORS.AZUL_1,
          '&:hover': {
            backgroundColor: 'rgba(3, 83, 179, 0.04)',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.8rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
          border: `1px solid ${TECNOSPEED_COLORS.BORDA_PRIMARIA}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: TECNOSPEED_COLORS.BRANCO,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: TECNOSPEED_COLORS.AZUL_2,
              borderWidth: '2px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: TECNOSPEED_COLORS.AZUL_1,
              borderWidth: '2px',
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderColor: TECNOSPEED_COLORS.ERRO,
            },
          },
          '& .MuiInputLabel-root': {
            color: TECNOSPEED_COLORS.TEXTO_SECUNDARIO,
            '&.Mui-focused': {
              color: TECNOSPEED_COLORS.AZUL_1,
            },
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: TECNOSPEED_COLORS.AZUL_1,
          },
          '&.Mui-active': {
            color: TECNOSPEED_COLORS.AZUL_1,
          },
        },
        label: {
          fontWeight: 600,
          '&.Mui-completed': {
            color: TECNOSPEED_COLORS.AZUL_1,
          },
          '&.Mui-active': {
            color: TECNOSPEED_COLORS.AZUL_1,
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': {
            color: TECNOSPEED_COLORS.AZUL_1,
          },
          '&.Mui-active': {
            color: TECNOSPEED_COLORS.AZUL_1,
          },
          '&.Mui-disabled': {
            color: TECNOSPEED_COLORS.CINZA_400,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: TECNOSPEED_COLORS.BRANCO,
          color: TECNOSPEED_COLORS.TEXTO_PRIMARIO,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: TECNOSPEED_COLORS.BRANCO,
          borderRight: `1px solid ${TECNOSPEED_COLORS.BORDA_PRIMARIA}`,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(3, 83, 179, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(3, 83, 179, 0.12)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
        },
        filled: {
          backgroundColor: TECNOSPEED_COLORS.CINZA_200,
          color: TECNOSPEED_COLORS.TEXTO_PRIMARIO,
        },
        outlined: {
          borderColor: TECNOSPEED_COLORS.BORDA_PRIMARIA,
          color: TECNOSPEED_COLORS.TEXTO_PRIMARIO,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: TECNOSPEED_COLORS.SUCESSO,
        },
        standardError: {
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          color: TECNOSPEED_COLORS.ERRO,
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          color: TECNOSPEED_COLORS.AVISO,
        },
        standardInfo: {
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          color: TECNOSPEED_COLORS.INFO,
        },
      },
    },
  },
});

// Aplicar responsividade nas tipografias
theme = responsiveFontSizes(theme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  factor: 2,
});

export default theme; 