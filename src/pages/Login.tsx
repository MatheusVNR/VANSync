import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import { authService } from '../services/auth.service';

interface FormData {
  email: string;
  password: string;
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
  background: linear-gradient(45deg, #1976D2 30%, #0D47A1 90%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Login(): React.ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      navigate('/bank-selection');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
            <Logo src="/tecno.png" alt="Tecnospeed" />
            <Typography variant="h5" component="h1" gutterBottom>
              Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <Link href="#" variant="body2" sx={{ alignSelf: 'flex-end', mb: 2 }}>
              Esqueci minha senha
            </Link>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    </FullScreenWrapper>
  );
}

export default Login;
