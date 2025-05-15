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
  InputLabel,
  Select,
  MenuItem,
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
  conta: string;
  convenio: string;
  gerenteConta: string;
  gerenteTelefone: string;
  gerenteEmail: string;
}

interface StepButtonProps {
  active?: boolean;
}

const StyledSidebar = styled(Paper)`
  width: 250px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100vh - 64px);
  position: fixed;
  left: 0;
  top: 64px;
`;

const StyledContent = styled(Box)`
  margin-left: 250px;
  padding: 24px;
`;

const StepButton = styled(Button)<StepButtonProps>`
  justify-content: flex-start;
  text-align: left;
  padding: 16px;
  background-color: ${props => props.active ? '#e3f2fd' : 'transparent'};
  &:hover {
    background-color: #e3f2fd;
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
    conta: '',
    convenio: '',
    gerenteConta: '',
    gerenteTelefone: '',
    gerenteEmail: '',
  });

  // Preencher o formulário com dados existentes no contexto, se houver
  useEffect(() => {
    if (vanData.companyData) {
      setFormData({
        ...formData,
        ...vanData.companyData,
        banco: vanData.selectedBank?.name || '',
      });
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    console.log('Formulário enviado com sucesso:', formData);
    
    // Salvar dados no contexto antes de navegar
    updateVanData({
      companyData: formData
    });
    
    // Navegue para a revisão
    navigate('/review');
  };

  const isFormValid = (): boolean => {
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = [
      'cnpj', 'razaoSocial', 'responsavelNome', 'responsavelCargo', 
      'responsavelTelefone', 'responsavelEmail', 'agencia', 'conta', 
      'convenio', 'gerenteConta', 'gerenteTelefone', 'gerenteEmail'
    ];
    
    return requiredFields.every(field => formData[field as keyof FormDataType]?.trim() !== '');
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
        <img
          src="/tecno_branca.png"
          alt="Tecnospeed"
          style={{ height: '30px' }}
        />
      </Box>

      {/* Sidebar */}
      <StyledSidebar elevation={1}>
        <StepButton variant="text" color="primary">
          1. Instituição bancária
        </StepButton>
        <StepButton variant="text" color="primary">
          2. Produtos
        </StepButton>
        <StepButton active variant="text" color="primary">
          3. Preenchimento de dados
        </StepButton>
        <StepButton variant="text" disabled>
          4. Conferir e validar
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
              Conta
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Agência"
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Conta"
                  name="conta"
                  value={formData.conta}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Convênio"
                  name="convenio"
                  value={formData.convenio}
                  onChange={handleChange}
                />
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
              <Button
                variant="outlined"
                onClick={() => navigate('/product-selection')}
              >
                Voltar
              </Button>
              <Button
                type="button"
                variant="contained"
                disabled={!isFormValid()}
                onClick={() => {
                  // Forçar o salvamento dos dados
                  updateVanData({
                    companyData: {
                      cnpj: (document.querySelector('input[name="cnpj"]') as HTMLInputElement)?.value || '',
                      razaoSocial: (document.querySelector('input[name="razaoSocial"]') as HTMLInputElement)?.value || '',
                      responsavelNome: (document.querySelector('input[name="responsavelNome"]') as HTMLInputElement)?.value || '',
                      responsavelCargo: (document.querySelector('input[name="responsavelCargo"]') as HTMLInputElement)?.value || '',
                      responsavelTelefone: (document.querySelector('input[name="responsavelTelefone"]') as HTMLInputElement)?.value || '',
                      responsavelEmail: (document.querySelector('input[name="responsavelEmail"]') as HTMLInputElement)?.value || '',
                      banco: vanData.selectedBank?.name || 'Banco Padrão',
                      agencia: (document.querySelector('input[name="agencia"]') as HTMLInputElement)?.value || '',
                      conta: (document.querySelector('input[name="conta"]') as HTMLInputElement)?.value || '',
                      convenio: (document.querySelector('input[name="convenio"]') as HTMLInputElement)?.value || '',
                      gerenteConta: (document.querySelector('input[name="gerenteConta"]') as HTMLInputElement)?.value || '',
                      gerenteTelefone: (document.querySelector('input[name="gerenteTelefone"]') as HTMLInputElement)?.value || '',
                      gerenteEmail: (document.querySelector('input[name="gerenteEmail"]') as HTMLInputElement)?.value || '',
                    }
                  });
                  
                  // Navegação usando JavaScript puro
                  window.location.href = '/review';
                }}
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