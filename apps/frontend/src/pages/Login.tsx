import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from 'styled-components';
import { authService } from '../services/authService';
import { maskCNPJ, validateCNPJ, removeMask } from '../utils/masks';

interface FormData {
  cnpj: string;
  token: string;
}

const Logo = styled.img`
  width: 200px;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  padding: 16px;
`;

const FullScreenWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url('/images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Login(): React.ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ cnpj: '', token: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [cnpjError, setCnpjError] = useState<string>('');

  // Verificar se usuário já está logado
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/menu');
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscaras
    if (name === 'cnpj') {
      formattedValue = maskCNPJ(value);
      setCnpjError('');
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar CNPJ
    if (!validateCNPJ(formData.cnpj)) {
      setCnpjError('CNPJ inválido');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(removeMask(formData.cnpj), formData.token);
      
      // Salvar tokens no sessionStorage
      const authData = {
        accessToken: response.token,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + (response.expiresIn * 1000)
      };
      
      sessionStorage.setItem('auth', JSON.stringify(authData));
      sessionStorage.setItem('user', JSON.stringify(response.user));

      // Redirecionar baseado no tipo de usuário
      if (response.user.tipo === 'ADMIN') {
        navigate('/menu');
      } else {
        navigate('/menu');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  return (
    <FullScreenWrapper>
      <StyledCard>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Logo src="/images/tecno.png" alt="Tecnospeed" />
            <Typography variant="h5" component="h1" gutterBottom>
              Login
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="cnpj"
              label="CNPJ"
              name="cnpj"
              autoComplete="off"
              autoFocus
              value={formData.cnpj}
              onChange={handleChange}
              disabled={loading}
              error={!!cnpjError}
              helperText={cnpjError}
              placeholder="00.000.000/0000-00"
              inputProps={{
                maxLength: 18
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="token"
              label="Token"
              type={showToken ? 'text' : 'password'}
              id="token"
              autoComplete="off"
              value={formData.token}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle token visibility"
                      onClick={toggleTokenVisibility}
                      edge="end"
                    >
                      {showToken ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ mt: 2 }} 
              disabled={loading || !formData.cnpj || !formData.token}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </FullScreenWrapper>
  );
}

export default Login;