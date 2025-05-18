import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
    FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import styled from 'styled-components';
import { useVan } from '../contexts/VanContext';

interface FormDataType {
  cnpj: string;
  razaoSocial: string;
  responsavelNome: string;
  responsavelCargo: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  banco: string;
  agencia: string;
  agenciaDv: string;
  conta: string;
  contaDv: string;
  convenio: string;
  cnab: string;
  gerenteConta: string;
  gerenteTelefone: string;
  gerenteEmail: string;
}

interface StepButtonProps {
  active?: boolean;
}

const StyledSidebar = styled(Paper)`
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
  background-color: #f5f5f5;
`;

const StyledContent = styled(Box)`
  margin-left: 300px;
  padding: 24px;
`;

const StepButton = styled(Box)<StepButtonProps>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: ${({ active }) => (active ? '#003f71' : '#f5f5f5')};
  color: ${({ active }) => (active ? '#ffffff' : '#333')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  opacity: ${({ active }) => (active === false ? 0.6 : 1)};
  pointer-events: ${({ active }) => (active === false ? 'none' : 'auto')};
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? '#003f71' : '#e0e0e0')};
  }
`;

function CompanyData(): React.ReactElement {
  const navigate = useNavigate();
  const { vanData, updateVanData } = useVan();

  const [formData, setFormData] = useState<FormDataType>({
  cnpj: '',
  razaoSocial: '',
  responsavelNome: '',
  responsavelCargo: '',
  responsavelTelefone: '',
  responsavelEmail: '',
  banco: vanData.selectedBank?.name || '',
  agencia: '',
  agenciaDv: '',
  conta: '',
  contaDv: '',
  convenio: '',
  cnab: '',
  gerenteConta: '',
  gerenteTelefone: '',
  gerenteEmail: '',
});


  useEffect(() => {
    if (vanData.companyData) {
      setFormData({
        ...formData,
        ...vanData.companyData,
        banco: vanData.selectedBank?.name || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    updateVanData({
      companyData: formData,
    });

    navigate('/review');
  };

  const isFormValid = (): boolean => {
    const requiredFields = [
      'cnpj',
      'razaoSocial',
      'responsavelNome',
      'responsavelCargo',
      'responsavelTelefone',
      'responsavelEmail',
      'agencia',
      'conta',
      'convenio',
      'gerenteConta',
      'gerenteTelefone',
      'gerenteEmail',
    ];

    return requiredFields.every(
      (field) => formData[field as keyof FormDataType]?.trim() !== ''
    );
  };

  return (
    <Box>
      {/* Header */}
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
        <img src="/tecno_branca.png" alt="Tecnospeed" style={{ height: '30px' }} />
      </Box>

      {/* Sidebar */}
      <StyledSidebar elevation={1}>
        <StepButton active={false} onClick={() => navigate('/bank-selection')}>
          <Typography variant="subtitle1" fontWeight="bold">
            Instituição bancária
          </Typography>
          <Typography variant="body2">Selecione uma instituição</Typography>
        </StepButton>

        <StepButton active={false} onClick={() => navigate('/product-selection')}>
          <Typography variant="subtitle1" fontWeight="bold">
            Produtos
          </Typography>
          <Typography variant="body2">Selecione um ou mais produtos</Typography>
        </StepButton>

        <StepButton active>
          <Typography variant="subtitle1" fontWeight="bold">
            Preenchimento de dados
          </Typography>
          <Typography variant="body2">Preencha os dados solicitados</Typography>
        </StepButton>

        <StepButton active={false}>
          <Typography variant="subtitle1" fontWeight="bold">
            Conferir e validar
          </Typography>
          <Typography variant="body2">Confirme os dados antes de enviar</Typography>
        </StepButton>
      </StyledSidebar>

      {/* Main Content */}
      <StyledContent>
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            3. Preencher dados da empresa e conta
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            A seguir precisamos coletar alguns dados que utilizaremos para elaborar a carta de VAN para o banco desejado.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Empresa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="CNPJ"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Razão Social"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Responsável pela Empresa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nome"
                  name="responsavelNome"
                  value={formData.responsavelNome}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Cargo"
                  name="responsavelCargo"
                  value={formData.responsavelCargo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefone"
                  name="responsavelTelefone"
                  value={formData.responsavelTelefone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="E-mail"
                  name="responsavelEmail"
                  type="email"
                  value={formData.responsavelEmail}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

           <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
 
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Conta
          </Typography>
         <Grid container spacing={2} alignItems="center">
  <Grid item xs={12} sm={4}>
    <TextField
      required
      fullWidth
      label="Banco"
      name="banco"
      value={formData.banco}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12} sm={2.2}>
    <TextField
      required
      fullWidth
      label="Agência"
      name="agencia"
      value={formData.agencia}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={6} sm={2}>
    <TextField
      required
      fullWidth
      label="DV Agência"
      name="agenciaDv"
      value={formData.agenciaDv}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12} sm={2.3}>
    <TextField
      required
      fullWidth
      label="Conta"
      name="conta"
      value={formData.conta}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={6} sm={1.5}>
    <TextField
      required
      fullWidth
      label="DV Conta"
      name="contaDv"
      value={formData.contaDv}
      onChange={handleChange}
    />
  </Grid>

  <Grid item xs={12} sm={4}>
    <TextField
      required
      fullWidth
      label="Convênio"
      name="convenio"
      value={formData.convenio}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <FormControl component="fieldset" required fullWidth>
      <FormLabel component="legend">CNAB</FormLabel>
      <RadioGroup
        row
        name="cnab"
        value={formData.cnab}
        onChange={handleChange}
      >
        <FormControlLabel value="240" control={<Radio />} label="240" />
        <FormControlLabel value="400" control={<Radio />} label="400" />
        <FormControlLabel value="444" control={<Radio />} label="444" />
      </RadioGroup>
    </FormControl>
  </Grid>
</Grid>



            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Gerente Conta
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nome"
                  name="gerenteConta"
                  value={formData.gerenteConta}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefone"
                  name="gerenteTelefone"
                  value={formData.gerenteTelefone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="E-mail"
                  name="gerenteEmail"
                  type="email"
                  value={formData.gerenteEmail}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" onClick={() => navigate('/product-selection')}>
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid()}
              >
                Revisar
              </Button>
            </Box>
          </Box>
        </Container>
      </StyledContent>
    </Box>
  );
}

export default CompanyData;
