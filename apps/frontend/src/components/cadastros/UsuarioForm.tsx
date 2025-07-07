import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Usuario, CreateUsuarioData } from '../../services/usuarioService';

interface UsuarioFormProps {
  initialData?: Usuario;
  onSubmit: (data: CreateUsuarioData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const TIPOS_USUARIO = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'SH', label: 'Software House' },
];

const UsuarioForm: React.FC<UsuarioFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [cnpj, setCnpj] = useState(initialData?.cnpj || '');
  const [token, setToken] = useState('');
  const [novoToken, setNovoToken] = useState('');
  const [confirmarToken, setConfirmarToken] = useState('');
  const [showTokenFields, setShowTokenFields] = useState(false);
  const [tipo, setTipo] = useState<'ADMIN' | 'SH'>(initialData?.tipo || 'SH');
  const [nomeEmpresa, setNomeEmpresa] = useState(initialData?.nome_empresa || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [telefone, setTelefone] = useState(initialData?.telefone || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  const handleShowTokenFields = () => {
    setShowTokenFields(true);
    setNovoToken('');
    setConfirmarToken('');
    setErrors({});
  };

  const handleHideTokenFields = () => {
    setShowTokenFields(false);
    setNovoToken('');
    setConfirmarToken('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!cnpj.replace(/\D/g, '')) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }
    
    if (!initialData && !token) {
      newErrors.token = 'Token é obrigatório';
    }
    
    if (showTokenFields) {
      if (!novoToken) {
        newErrors.novoToken = 'Novo token é obrigatório';
      } else if (novoToken.length < 6) {
        newErrors.novoToken = 'Token deve ter pelo menos 6 caracteres';
      }
      
      if (!confirmarToken) {
        newErrors.confirmarToken = 'Confirmação do token é obrigatória';
      } else if (novoToken !== confirmarToken) {
        newErrors.confirmarToken = 'Tokens não coincidem';
      }
    }
    
    if (!tipo) {
      newErrors.tipo = 'Tipo de usuário é obrigatório';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Limpa o CNPJ para envio (remove máscaras)
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    // Define qual token usar
    const tokenToSend = showTokenFields ? novoToken : (token || '********');
    
    onSubmit({
      cnpj: cleanCnpj,
      token: tokenToSend,
      tipo,
      nome_empresa: nomeEmpresa.trim() || undefined,
      email: email.trim() || undefined,
      telefone: telefone.trim() || undefined,
    });
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        maxWidth: 600, 
        mx: 'auto',
        borderRadius: 2,
      }}
    >
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        component="h2" 
        gutterBottom
        sx={{ 
          textAlign: 'center', 
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 3,
        }}
      >
        {initialData ? 'Editar Usuário' : 'Novo Usuário'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* CNPJ */}
        <TextField
          label="CNPJ"
          value={cnpj}
          onChange={handleCnpjChange}
          fullWidth
          required
          error={!!errors.cnpj}
          helperText={errors.cnpj}
          sx={{ mb: 3 }}
          placeholder="00.000.000/0000-00"
          inputProps={{ maxLength: 18 }}
        />

        {/* Token - Criação */}
        {!initialData && (
          <TextField
            name="token"
            label="Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            fullWidth
            required
            error={!!errors.token}
            helperText={errors.token || 'Token de acesso do usuário (mínimo 6 caracteres)'}
            sx={{ mb: 3 }}
            placeholder="Digite o token de acesso"
            inputProps={{ minLength: 6 }}
          />
        )}

        {/* Alteração de Token - Edição */}
        {initialData && (
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity="info" 
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handleHideTokenFields}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Token atual: <strong>••••••••</strong>
              {!showTokenFields && (
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleShowTokenFields}
                  sx={{ ml: 2 }}
                >
                  Alterar Token
                </Button>
              )}
            </Alert>

            <Collapse in={showTokenFields}>
              <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Alterar Token de Acesso
                </Typography>
                
                <TextField
                  name="novoToken"
                  label="Novo Token"
                  type="password"
                  value={novoToken}
                  onChange={(e) => setNovoToken(e.target.value)}
                  fullWidth
                  required={showTokenFields}
                  error={!!errors.novoToken}
                  helperText={errors.novoToken || 'Digite o novo token (mínimo 6 caracteres)'}
                  sx={{ mb: 2 }}
                  placeholder="Novo token de acesso"
                  inputProps={{ minLength: 6 }}
                />
                
                <TextField
                  name="confirmarToken"
                  label="Confirmar Novo Token"
                  type="password"
                  value={confirmarToken}
                  onChange={(e) => setConfirmarToken(e.target.value)}
                  fullWidth
                  required={showTokenFields}
                  error={!!errors.confirmarToken}
                  helperText={errors.confirmarToken || 'Confirme o novo token'}
                  sx={{ mb: 1 }}
                  placeholder="Confirme o novo token"
                  inputProps={{ minLength: 6 }}
                />
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Tipo de Usuário */}
        <FormControl fullWidth required error={!!errors.tipo} sx={{ mb: 3 }}>
          <InputLabel>Tipo de Usuário</InputLabel>
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'ADMIN' | 'SH')}
            label="Tipo de Usuário"
          >
            {TIPOS_USUARIO.map((tipoOption) => (
              <MenuItem key={tipoOption.value} value={tipoOption.value}>
                {tipoOption.label}
              </MenuItem>
            ))}
          </Select>
          {errors.tipo && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {errors.tipo}
            </Typography>
          )}
        </FormControl>

        {/* Nome da Empresa */}
        <TextField
          label="Nome da Empresa"
          value={nomeEmpresa}
          onChange={(e) => setNomeEmpresa(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          placeholder="Nome da empresa ou instituição"
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 3 }}
          placeholder="email@exemplo.com"
        />

        {/* Telefone */}
        <TextField
          label="Telefone"
          value={telefone}
          onChange={handleTelefoneChange}
          fullWidth
          sx={{ mb: 4 }}
          placeholder="(00) 00000-0000"
          inputProps={{ maxLength: 15 }}
        />

        {/* Botões */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<CancelIcon />}
              disabled={loading}
              sx={{ 
                minWidth: { xs: '100%', sm: 120 },
                order: { xs: 2, sm: 1 },
              }}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{ 
              minWidth: { xs: '100%', sm: 120 },
              order: { xs: 1, sm: 2 },
              backgroundColor: theme.palette.success.main,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UsuarioForm; 