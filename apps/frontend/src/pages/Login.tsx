import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCNPJ(e.target.value);
    setCnpj(maskedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação do CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      setError('CNPJ inválido. O CNPJ deve conter 14 dígitos.');
      setLoading(false);
      return;
    }

    try {
      await authService.login(cnpjLimpo, token);
      navigate('/menu');
    } catch (err: any) {
      if (err?.response?.data?.message === 'CNPJ ou Token inválidos' || err?.message === 'CNPJ ou Token inválidos') {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      } else {
        setError(err.message || 'Erro ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url(/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card 
          sx={{ 
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            boxShadow: theme.shadows[8],
            mx: 'auto',
          }}
        >
          <CardContent sx={{ p: isMobile ? 3 : 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                component="img"
                src="/images/tecno.png"
                alt="Tecnospeed"
                sx={{
                  width: 200,
                  height: 'auto',
                  mb: 3,
                }}
              />
              
              <Typography 
                variant="h5" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  mb: 1
                }}
              >
                Login
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="CNPJ"
                value={cnpj}
                onChange={handleCnpjChange}
                margin="normal"
                required
                placeholder="00.000.000/0000-00"
                inputProps={{ maxLength: 18 }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Token"
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowToken(!showToken)}
                        edge="end"
                      >
                        {showToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="caption" color="text.secondary">
                © 2025 VANSync. Todos os direitos reservados.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;