import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import InputMasked from '../../InputMasked';

interface Passo3CartaFormProps {
  bank: any;
  selectedProducts?: string[];
  formData?: any;
  onBack: () => void;
  onNext: (data: any) => void;
}

interface FormData {
  cnpjSoftwareHouse: string;
  cnpjEmitente: string;
  razaoSocial: string;
  nomeResponsavel: string;
  cargoResponsavel: string;
  telefone: string;
  email: string;
  agencia: string;
  agenciaDV: string;
  conta: string;
  contaDV: string;
  convenio: string;
  cnab: string;
  nomeGerente: string;
  telefoneGerente: string;
  emailGerente: string;
}

const Passo3CartaForm: React.FC<Passo3CartaFormProps> = ({
  bank,
  selectedProducts = [],
  formData = {},
  onBack,
  onNext,
}) => {
  // Garantir que formData seja sempre um objeto válido
  const safeFormData = formData || {};
  
  const [form, setForm] = useState<FormData>({
    cnpjSoftwareHouse: safeFormData.cnpjSoftwareHouse || '',
    cnpjEmitente: safeFormData.cnpjEmitente || '',
    razaoSocial: safeFormData.razaoSocial || '',
    nomeResponsavel: safeFormData.nomeResponsavel || '',
    cargoResponsavel: safeFormData.cargoResponsavel || '',
    telefone: safeFormData.telefone || '',
    email: safeFormData.email || '',
    agencia: safeFormData.agencia || '',
    agenciaDV: safeFormData.agenciaDV || '',
    conta: safeFormData.conta || '',
    contaDV: safeFormData.contaDV || '',
    convenio: safeFormData.convenio || '',
    cnab: safeFormData.cnab || '',
    nomeGerente: safeFormData.nomeGerente || '',
    telefoneGerente: safeFormData.telefoneGerente || '',
    emailGerente: safeFormData.emailGerente || '',
  });

  const [errors, setErrors] = useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Obter CNABs disponíveis para o banco
  const getCNABOptions = () => {
    const options = [];
    if (bank?.cnab240) options.push({ value: 'CNAB240', label: 'CNAB 240' });
    if (bank?.cnab400) options.push({ value: 'CNAB400', label: 'CNAB 400' });
    if (bank?.cnab444) options.push({ value: 'CNAB444', label: 'CNAB 444' });
    return options;
  };

  useEffect(() => {
    if (formData && typeof formData === 'object') {
      setForm((prev: FormData) => ({ ...prev, ...formData }));
    }
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev: FormData) => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.cnpjEmitente) newErrors.cnpjEmitente = 'CNPJ do emitente é obrigatório';
    if (!form.razaoSocial) newErrors.razaoSocial = 'Razão social é obrigatória';
    if (!form.nomeResponsavel) newErrors.nomeResponsavel = 'Nome do responsável é obrigatório';
    if (!form.cargoResponsavel) newErrors.cargoResponsavel = 'Cargo do responsável é obrigatório';
    if (!form.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!form.email) newErrors.email = 'Email é obrigatório';
    if (!form.agencia) newErrors.agencia = 'Agência é obrigatória';
    if (!form.conta) newErrors.conta = 'Conta é obrigatória';
    if (!form.convenio) newErrors.convenio = 'Convênio é obrigatório';
    if (!form.cnab) newErrors.cnab = 'CNAB é obrigatório';
    if (!form.nomeGerente) newErrors.nomeGerente = 'Nome do gerente é obrigatório';
    if (!form.telefoneGerente) newErrors.telefoneGerente = 'Telefone do gerente é obrigatório';
    if (!form.emailGerente) newErrors.emailGerente = 'Email do gerente é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(form);
    }
  };

  if (!bank) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Nenhum banco selecionado. Volte ao passo anterior.
        </Alert>
      </Box>
    );
  }

  const cnabOptions = getCNABOptions();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Preenchimento de Dados
      </Typography>

      {/* Resumo das Seleções */}
      <Card sx={{ mb: 3, backgroundColor: theme.palette.grey[50] }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Banco: {bank.nome}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Código: {bank.codigo.toString().padStart(3, '0')} • Padrão: {bank.padrao_van}
          </Typography>
          
          {selectedProducts.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Produtos Selecionados:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedProducts.map((produto) => (
                  <Chip
                    key={produto}
                    label={produto}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Formulário */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Dados da Software House */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
            Dados da Software House
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <InputMasked
              label="CNPJ da Software House"
              value={form.cnpjSoftwareHouse}
              onChange={(value) => handleInputChange('cnpjSoftwareHouse', value)}
              mask="cnpj"
              error={!!errors.cnpjSoftwareHouse}
              helperText={errors.cnpjSoftwareHouse}
              fullWidth
            />
          </Box>
        </Box>

        {/* Dados do Emitente */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main, mt: 2 }}>
            Dados do Emitente
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <InputMasked
              label="CNPJ do Emitente *"
              value={form.cnpjEmitente}
              onChange={(value) => handleInputChange('cnpjEmitente', value)}
              mask="cnpj"
              error={!!errors.cnpjEmitente}
              helperText={errors.cnpjEmitente}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Razão Social *"
              value={form.razaoSocial}
              onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
              error={!!errors.razaoSocial}
              helperText={errors.razaoSocial}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Nome do Responsável *"
              value={form.nomeResponsavel}
              onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
              error={!!errors.nomeResponsavel}
              helperText={errors.nomeResponsavel}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Cargo do Responsável *"
              value={form.cargoResponsavel}
              onChange={(e) => handleInputChange('cargoResponsavel', e.target.value)}
              error={!!errors.cargoResponsavel}
              helperText={errors.cargoResponsavel}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <InputMasked
              label="Telefone *"
              value={form.telefone}
              onChange={(value) => handleInputChange('telefone', value)}
              mask="phone"
              error={!!errors.telefone}
              helperText={errors.telefone}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Email *"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
          </Box>
        </Box>

        {/* Dados Bancários */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main, mt: 2 }}>
            Dados Bancários
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              label="Agência *"
              value={form.agencia}
              onChange={(e) => handleInputChange('agencia', e.target.value)}
              error={!!errors.agencia}
              helperText={errors.agencia}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '0 1 100px', minWidth: 0 }}>
            <TextField
              label="DV"
              value={form.agenciaDV}
              onChange={(e) => handleInputChange('agenciaDV', e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <TextField
              label="Conta *"
              value={form.conta}
              onChange={(e) => handleInputChange('conta', e.target.value)}
              error={!!errors.conta}
              helperText={errors.conta}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '0 1 100px', minWidth: 0 }}>
            <TextField
              label="DV"
              value={form.contaDV}
              onChange={(e) => handleInputChange('contaDV', e.target.value)}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Convênio *"
              value={form.convenio}
              onChange={(e) => handleInputChange('convenio', e.target.value)}
              error={!!errors.convenio}
              helperText={errors.convenio}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <FormControl fullWidth error={!!errors.cnab}>
              <InputLabel>CNAB *</InputLabel>
              <Select
                value={form.cnab}
                label="CNAB *"
                onChange={(e) => handleInputChange('cnab', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: errors.cnab ? theme.palette.error.main : undefined,
                  },
                }}
              >
                <MenuItem value="">
                  <em>Selecione um CNAB</em>
                </MenuItem>
                {cnabOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.cnab && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.cnab}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>

        {/* Dados do Gerente */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main, mt: 2 }}>
            Dados do Gerente
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Nome do Gerente *"
              value={form.nomeGerente}
              onChange={(e) => handleInputChange('nomeGerente', e.target.value)}
              error={!!errors.nomeGerente}
              helperText={errors.nomeGerente}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <InputMasked
              label="Telefone do Gerente *"
              value={form.telefoneGerente}
              onChange={(value) => handleInputChange('telefoneGerente', value)}
              mask="phone"
              error={!!errors.telefoneGerente}
              helperText={errors.telefoneGerente}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Email do Gerente *"
              value={form.emailGerente}
              onChange={(e) => handleInputChange('emailGerente', e.target.value)}
              error={!!errors.emailGerente}
              helperText={errors.emailGerente}
              fullWidth
            />
          </Box>
        </Box>

        {/* Botões */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            sx={{ minWidth: 120 }}
          >
            Voltar
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ 
              minWidth: 120,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Próximo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Passo3CartaForm;