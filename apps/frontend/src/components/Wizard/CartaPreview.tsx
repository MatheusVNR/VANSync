import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BankIcon,
  Description as ProductIcon,
  Person as PersonIcon,
  AccountBalance as AccountIcon,
} from '@mui/icons-material';

interface CartaPreviewProps {
  produtos: string[];
  formData: any;
  selectedBank: any;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}

const CartaPreview: React.FC<CartaPreviewProps> = ({ 
  produtos, 
  formData, 
  selectedBank, 
  onConfirm, 
  onBack, 
  loading 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        4. Conferir e validar
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Revise os dados antes de enviar a solicitação
      </Typography>

      {/* Resumo dos dados */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Banco e Produtos */}
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BankIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Instituição Bancária
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{selectedBank?.codigo?.toString().padStart(3, '0')} - {selectedBank?.nome}</strong>
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ProductIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Produtos Selecionados
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {produtos.map((produto, index) => (
                <Chip
                  key={index}
                  label={produto}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Dados da Empresa */}
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Dados da Empresa
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>CNPJ Software House:</strong> {formatCNPJ(formData?.cnpjSoftwareHouse || '')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>CNPJ Emitente:</strong> {formatCNPJ(formData?.cnpjEmitente || '')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Razão Social:</strong> {formData?.razaoSocial}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Responsável:</strong> {formData?.nomeResponsavel} ({formData?.cargoResponsavel})
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Telefone:</strong> {formatPhone(formData?.telefone || '')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>E-mail:</strong> {formData?.email}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Dados Bancários */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Dados Bancários
            </Typography>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Agência:</strong> {formData?.agencia}
                {formData?.agenciaDV && `-${formData.agenciaDV}`}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Conta:</strong> {formData?.conta}-{formData?.contaDV}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Convênio:</strong> {formData?.convenio}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>CNAB:</strong> {formData?.cnab}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Gerente:</strong> {formData?.nomeGerente}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Telefone Gerente:</strong> {formatPhone(formData?.telefoneGerente || '')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>E-mail Gerente:</strong> {formData?.emailGerente}
          </Typography>
        </CardContent>
      </Card>

      {/* Aviso importante */}
      <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body2">
          <strong>Importante:</strong> O limite de cartas simultâneas por Software House é de 5 solicitações. 
          Após esse limite, será necessário aguardar a liberação das solicitações já abertas.
        </Typography>
      </Alert>

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
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Voltar
        </Button>
        
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
          sx={{ 
            minWidth: 200,
            py: 1.5,
          }}
        >
          {loading ? 'Criando Solicitação...' : 'Confirmar e Enviar'}
        </Button>
      </Box>
    </Box>
  );
};

export default CartaPreview;