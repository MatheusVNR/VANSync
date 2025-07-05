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
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Business as BusinessIcon,
} from '@mui/icons-material';
import InputMasked from '../../InputMasked';
import BackButton from '../../BackButton';
import { authService } from '../../../services/authService';
import * as Yup from 'yup';

interface Passo3CartaFormProps {
  bank: any;
  selectedProducts?: string[];
  formData?: any;
  fornecedorVan: string;
  onBack: () => void;
  onNext: (data: any) => void;
}

interface FormData {
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
  fornecedorVan: string;
  cidade?: string;
  estado?: string;
  preferencia_contato_gerente?: string;
}

const validationSchema = (fornecedorVan: string) => Yup.object({
  cnpjEmitente: Yup.string().required('CNPJ do emitente é obrigatório'),
  razaoSocial: Yup.string().required('Razão social é obrigatória'),
  nomeResponsavel: Yup.string().required('Nome do responsável é obrigatório'),
  cargoResponsavel: Yup.string().required('Cargo do responsável é obrigatório'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  agencia: Yup.string().required('Agência é obrigatória'),
  conta: Yup.string().required('Conta é obrigatória'),
  convenio: Yup.string().required('Convênio é obrigatório'),
  cnab: Yup.string().required('CNAB é obrigatório'),
  fornecedorVan: Yup.string().required('Fornecedor VAN é obrigatório'),
  nomeGerente: Yup.string().required('Nome do gerente é obrigatório'),
  telefoneGerente: Yup.string().required('Telefone do gerente é obrigatório'),
  emailGerente: Yup.string().email('Email do gerente inválido').required('Email do gerente é obrigatório'),
  cidade: fornecedorVan?.toLowerCase() === 'nexxera' 
    ? Yup.string().required('Cidade é obrigatória para Nexxera')
    : Yup.string().optional(),
  estado: fornecedorVan?.toLowerCase() === 'nexxera'
    ? Yup.string().required('UF é obrigatória para Nexxera').max(2, 'UF deve ter no máximo 2 caracteres')
    : Yup.string().optional().max(2, 'UF deve ter no máximo 2 caracteres'),
  preferencia_contato_gerente: fornecedorVan?.toLowerCase() === 'nexxera'
    ? Yup.string().required('Preferência de contato é obrigatória para Nexxera')
    : Yup.string().optional(),
});

const Passo3CartaForm: React.FC<Passo3CartaFormProps> = ({
  bank,
  selectedProducts = [],
  formData = {},
  fornecedorVan,
  onBack,
  onNext,
}) => {
  const currentUser = authService.getCurrentUser();
  // Garantir que formData seja sempre um objeto válido
  const safeFormData = formData || {};
  
  const [form, setForm] = useState<FormData>({
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
    fornecedorVan: safeFormData.fornecedorVan || '',
    cidade: safeFormData.cidade || '',
    estado: safeFormData.estado || '',
    preferencia_contato_gerente: safeFormData.preferencia_contato_gerente || 'Email',
  });

  const [errors, setErrors] = useState<any>({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const theme = useTheme();

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

  const validateForm = async () => {
    try {
      // Usar Yup para validação mais robusta
      await validationSchema(form.fornecedorVan).validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError: any) {
      const newErrors: any = {};
      
      if (validationError.inner) {
        validationError.inner.forEach((error: any) => {
          newErrors[error.path] = error.message;
        });
      }
      
      setErrors(newErrors);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateForm();
    
    if (isValid) {
      onNext(form);
    } else {
      // Contar quantos campos têm erro
      const errorCount = Object.keys(errors).length;
      const errorFields = Object.keys(errors);
      
      let message = '';
      if (errorCount === 1) {
        message = `Existe 1 campo inválido. Verifique: ${errorFields[0]}`;
      } else if (errorCount <= 3) {
        message = `Existem ${errorCount} campos inválidos. Verifique: ${errorFields.join(', ')}`;
      } else {
        message = `Existem ${errorCount} campos inválidos. Por favor, verifique todos os campos obrigatórios.`;
      }
      
      setValidationMessage(message);
      setShowValidationAlert(true);
      
      // Scroll para o primeiro campo com erro
      const firstErrorField = errorFields[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                          document.querySelector(`[data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleCloseAlert = () => {
    setShowValidationAlert(false);
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

      {/* Alert de validação */}
      <Snackbar
        open={showValidationAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="warning" 
          sx={{ width: '100%' }}
        >
          {validationMessage}
        </Alert>
      </Snackbar>

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
        {/* Dados do Emitente - Organização conforme padrão solicitado */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
            Empresa
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <InputMasked
              label="CNPJ *"
              value={form.cnpjEmitente}
              onChange={(value) => handleInputChange('cnpjEmitente', value)}
              mask="cnpj"
              error={!!errors.cnpjEmitente}
              helperText={errors.cnpjEmitente}
              fullWidth
              placeholder="Inserir número do CNPJ"
              data-field="cnpjEmitente"
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
              placeholder="Inserir a Razão Social"
              name="razaoSocial"
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main, mt: 2 }}>
            Responsável pela Empresa
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Nome *"
              value={form.nomeResponsavel}
              onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
              error={!!errors.nomeResponsavel}
              helperText={errors.nomeResponsavel}
              fullWidth
              placeholder="Inserir nome do responsável pela empresa"
              name="nomeResponsavel"
            />
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="Cargo *"
              value={form.cargoResponsavel}
              onChange={(e) => handleInputChange('cargoResponsavel', e.target.value)}
              error={!!errors.cargoResponsavel}
              helperText={errors.cargoResponsavel}
              fullWidth
              placeholder="Inserir o cargo do responsável pela empresa"
              name="cargoResponsavel"
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
              placeholder="Inserir telefone do responsável pela empresa"
              data-field="telefone"
            />
          </Box>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <TextField
              label="E-mail *"
              value={form.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              placeholder="Inserir o e-mail do responsável pela empresa"
              name="email"
              type="email"
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
              name="agencia"
            />
          </Box>

          <Box sx={{ flex: '0 1 100px', minWidth: 0 }}>
            <TextField
              label="DV"
              value={form.agenciaDV}
              onChange={(e) => handleInputChange('agenciaDV', e.target.value)}
              fullWidth
              name="agenciaDV"
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
              name="conta"
            />
          </Box>

          <Box sx={{ flex: '0 1 100px', minWidth: 0 }}>
            <TextField
              label="DV"
              value={form.contaDV}
              onChange={(e) => handleInputChange('contaDV', e.target.value)}
              fullWidth
              name="contaDV"
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
              name="convenio"
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
                name="cnab"
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

        {/* Seleção de Fornecedor VAN */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main, mt: 2 }}>
            Fornecedor VAN
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <FormControl fullWidth error={!!errors.fornecedorVan}>
              <InputLabel>Fornecedor VAN *</InputLabel>
              <Select
                value={form.fornecedorVan}
                label="Fornecedor VAN *"
                onChange={(e) => handleInputChange('fornecedorVan', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: errors.fornecedorVan ? theme.palette.error.main : undefined,
                  },
                }}
                name="fornecedorVan"
              >
                <MenuItem value="">
                  <em>Selecione um fornecedor</em>
                </MenuItem>
                <MenuItem value="nexxera">Nexxera</MenuItem>
                <MenuItem value="finnet">Finnet</MenuItem>
              </Select>
              {errors.fornecedorVan && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.fornecedorVan}
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
              name="nomeGerente"
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
              data-field="telefoneGerente"
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
              name="emailGerente"
              type="email"
            />
          </Box>
        </Box>

        {/* Dados Adicionais (Exclusivo Nexxera) */}
        {form.fornecedorVan?.toLowerCase() === 'nexxera' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
              Dados Adicionais (Exclusivo Nexxera)
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Cidade *"
                value={form.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                error={!!errors.cidade}
                helperText={errors.cidade}
                placeholder="Digite a cidade"
                name="cidade"
              />
              <TextField
                fullWidth
                label="Estado (UF) *"
                value={form.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                error={!!errors.estado}
                helperText={errors.estado}
                inputProps={{ maxLength: 2 }}
                placeholder="Digite a UF (ex: SP)"
                name="estado"
              />
            </Box>
            
            <FormControl fullWidth error={!!errors.preferencia_contato_gerente}>
              <InputLabel>Preferência de Contato do Gerente *</InputLabel>
              <Select
                value={form.preferencia_contato_gerente}
                label="Preferência de Contato do Gerente *"
                onChange={(e) => handleInputChange('preferencia_contato_gerente', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: errors.preferencia_contato_gerente ? theme.palette.error.main : undefined,
                  },
                }}
                name="preferencia_contato_gerente"
              >
                <MenuItem value="">
                  <em>Selecione a preferência de contato</em>
                </MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Telefone">Telefone</MenuItem>
                <MenuItem value="Whatsapp">Whatsapp</MenuItem>
              </Select>
              {errors.preferencia_contato_gerente && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.preferencia_contato_gerente}
                </Typography>
              )}
            </FormControl>
          </>
        )}

        {/* Botões */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <BackButton 
            onClick={onBack}
            text="Voltar"
          />
          
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