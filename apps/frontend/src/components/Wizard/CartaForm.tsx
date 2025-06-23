import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from '@mui/material';
import { authService } from '../../services/authService';

interface CartaFormProps {
  banco: { nome: string };
  fornecedorVan: string;
  onSubmit: (values: any) => void;
  onBack: () => void;
}

const validationSchema = (fornecedorVan: string) => Yup.object({
  cnpjSoftwareHouse: Yup.string().when([], {
    is: () => fornecedorVan === 'Nexxera',
    then: schema => schema.required('Obrigatório'),
    otherwise: schema => schema.optional(),
  }),
  cnpjEmitente: Yup.string().required('Obrigatório'),
  razaoSocial: Yup.string().required('Obrigatório'),
  nomeResponsavel: Yup.string().required('Obrigatório'),
  cargoResponsavel: Yup.string().required('Obrigatório'),
  telefone: Yup.string().required('Obrigatório'),
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  agencia: Yup.string().required('Obrigatório'),
  agenciaDV: Yup.string(),
  conta: Yup.string().required('Obrigatório'),
  contaDV: Yup.string().required('Obrigatório'),
  convenio: Yup.string().required('Obrigatório'),
  cnab: Yup.string().required('Obrigatório'),
  nomeGerente: Yup.string().required('Obrigatório'),
  telefoneGerente: Yup.string().required('Obrigatório'),
  emailGerente: Yup.string().email('Email inválido').required('Obrigatório'),
  cidade: Yup.string().when([], {
    is: () => fornecedorVan === 'Nexxera',
    then: schema => schema.required('Cidade é obrigatória para Nexxera'),
    otherwise: schema => schema.optional(),
  }),
  estado: Yup.string().when([], {
    is: () => fornecedorVan === 'Nexxera',
    then: schema => schema.required('Estado é obrigatório para Nexxera'),
    otherwise: schema => schema.optional(),
  }),
  preferencia_contato_gerente: Yup.string().when([], {
    is: () => fornecedorVan === 'Nexxera',
    then: schema => schema.required('Preferência de contato é obrigatória para Nexxera'),
    otherwise: schema => schema.optional(),
  }),
});

const CartaForm: React.FC<CartaFormProps> = ({ banco, fornecedorVan, onSubmit, onBack }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentUser = authService.getCurrentUser();

  const formik = useFormik({
    initialValues: {
      cnpjSoftwareHouse: currentUser?.cnpj || '',
      cnpjEmitente: '',
      razaoSocial: '',
      cidade: '',
      estado: '',
      nomeResponsavel: '',
      cargoResponsavel: '',
      telefone: '',
      email: '',
      agencia: '',
      agenciaDV: '',
      conta: '',
      contaDV: '',
      convenio: '',
      cnab: '',
      nomeGerente: '',
      telefoneGerente: '',
      emailGerente: '',
      preferencia_contato_gerente: 'Email',
    },
    validationSchema: validationSchema(fornecedorVan),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleCNPJChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCNPJ(e.target.value);
    formik.setFieldValue(field, maskedValue);
  };

  const handlePhoneChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhone(e.target.value);
    formik.setFieldValue(field, maskedValue);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        3. Preenchimento de dados
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Preencha os dados necessários para a geração da carta
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {/* Dados da Software House */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                  Dados da Software House
                </Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="CNPJ Software House"
                  name="cnpjSoftwareHouse"
                  value={formik.values.cnpjSoftwareHouse}
                  disabled
                  helperText="CNPJ da sua empresa, preenchido automaticamente."
                />

                <TextField
                  fullWidth
                  label="CNPJ Emitente"
                  name="cnpjEmitente"
                  value={formik.values.cnpjEmitente}
                  onChange={handleCNPJChange('cnpjEmitente')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cnpjEmitente && Boolean(formik.errors.cnpjEmitente)}
                  helperText={formik.touched.cnpjEmitente && formik.errors.cnpjEmitente as string}
                  placeholder="00.000.000/0000-00"
                  inputProps={{ maxLength: 18 }}
                />
              </Box>

              <TextField
                fullWidth
                label="Razão Social"
                name="razaoSocial"
                value={formik.values.razaoSocial}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.razaoSocial && Boolean(formik.errors.razaoSocial)}
                helperText={formik.touched.razaoSocial && formik.errors.razaoSocial as string}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Nome do Responsável"
                  name="nomeResponsavel"
                  value={formik.values.nomeResponsavel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nomeResponsavel && Boolean(formik.errors.nomeResponsavel)}
                  helperText={formik.touched.nomeResponsavel && formik.errors.nomeResponsavel as string}
                />

                <TextField
                  fullWidth
                  label="Cargo do Responsável"
                  name="cargoResponsavel"
                  value={formik.values.cargoResponsavel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cargoResponsavel && Boolean(formik.errors.cargoResponsavel)}
                  helperText={formik.touched.cargoResponsavel && formik.errors.cargoResponsavel as string}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"
                  value={formik.values.telefone}
                  onChange={handlePhoneChange('telefone')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.telefone && Boolean(formik.errors.telefone)}
                  helperText={formik.touched.telefone && formik.errors.telefone as string}
                  placeholder="(00) 00000-0000"
                />

                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email as string}
                />
              </Box>

              {/* Dados Bancários */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
                  Dados Bancários
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Banco"
                value={banco.nome}
                InputProps={{ readOnly: true }}
                sx={{ backgroundColor: theme.palette.grey[100] }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Agência"
                  name="agencia"
                  value={formik.values.agencia}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.agencia && Boolean(formik.errors.agencia)}
                  helperText={formik.touched.agencia && formik.errors.agencia as string}
                />

                <TextField
                  fullWidth
                  label="Agência DV"
                  name="agenciaDV"
                  value={formik.values.agenciaDV}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.agenciaDV && Boolean(formik.errors.agenciaDV)}
                  helperText={formik.touched.agenciaDV && formik.errors.agenciaDV as string}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Conta"
                  name="conta"
                  value={formik.values.conta}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.conta && Boolean(formik.errors.conta)}
                  helperText={formik.touched.conta && formik.errors.conta as string}
                />

                <TextField
                  fullWidth
                  label="Conta DV"
                  name="contaDV"
                  value={formik.values.contaDV}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.contaDV && Boolean(formik.errors.contaDV)}
                  helperText={formik.touched.contaDV && formik.errors.contaDV as string}
                />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Convênio"
                  name="convenio"
                  value={formik.values.convenio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.convenio && Boolean(formik.errors.convenio)}
                  helperText={formik.touched.convenio && formik.errors.convenio as string}
                />

                <TextField
                  fullWidth
                  select
                  label="CNAB"
                  name="cnab"
                  value={formik.values.cnab}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cnab && Boolean(formik.errors.cnab)}
                  helperText={formik.touched.cnab && formik.errors.cnab as string}
                >
                  <MenuItem value="">Selecione</MenuItem>
                  <MenuItem value="CNAB240">CNAB240</MenuItem>
                  <MenuItem value="CNAB400">CNAB400</MenuItem>
                  <MenuItem value="CNAB444">CNAB444</MenuItem>
                </TextField>
              </Box>

              {/* Dados do Gerente */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.info.main }}>
                  Dados do Gerente
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Nome do Gerente"
                  name="nomeGerente"
                  value={formik.values.nomeGerente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nomeGerente && Boolean(formik.errors.nomeGerente)}
                  helperText={formik.touched.nomeGerente && formik.errors.nomeGerente as string}
                />

                <TextField
                  fullWidth
                  label="Telefone do Gerente"
                  name="telefoneGerente"
                  value={formik.values.telefoneGerente}
                  onChange={handlePhoneChange('telefoneGerente')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.telefoneGerente && Boolean(formik.errors.telefoneGerente)}
                  helperText={formik.touched.telefoneGerente && formik.errors.telefoneGerente as string}
                  placeholder="(00) 00000-0000"
                />
              </Box>

              <TextField
                fullWidth
                label="E-mail do Gerente"
                name="emailGerente"
                type="email"
                value={formik.values.emailGerente}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.emailGerente && Boolean(formik.errors.emailGerente)}
                helperText={formik.touched.emailGerente && formik.errors.emailGerente as string}
              />

              {fornecedorVan === 'Nexxera' && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2, color: theme.palette.primary.main }}>
                    Dados Adicionais (Nexxera)
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Cidade"
                      name="cidade"
                      value={formik.values.cidade}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.cidade && Boolean(formik.errors.cidade)}
                      helperText={formik.touched.cidade && formik.errors.cidade as string}
                    />
                    <TextField
                      fullWidth
                      label="Estado (UF)"
                      name="estado"
                      value={formik.values.estado}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.estado && Boolean(formik.errors.estado)}
                      helperText={formik.touched.estado && formik.errors.estado as string}
                      inputProps={{ maxLength: 2 }}
                    />
                  </Box>
                  <TextField
                    select
                    fullWidth
                    label="Preferência de Contato do Gerente"
                    name="preferencia_contato_gerente"
                    value={formik.values.preferencia_contato_gerente}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Email">Email</MenuItem>
                    <MenuItem value="Telefone">Telefone</MenuItem>
                    <MenuItem value="Whatsapp">Whatsapp</MenuItem>
                    <MenuItem value="Outro">Outro</MenuItem>
                  </TextField>
                </>
              )}
            </Box>

            {/* Botões de ação */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 2 : 0
            }}>
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{ minWidth: 120 }}
              >
                Voltar
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  minWidth: 200,
                  py: 1.5,
                }}
              >
                Revisar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CartaForm;