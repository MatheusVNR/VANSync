import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface BancoFormProps {
  initialData?: {
    nome: string;
    padrao_van: string;
    cnab240?: boolean;
    cnab400?: boolean;
    cnab444?: boolean;
    produtos?: string[] | string;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const PRODUTOS_DISPONIVEIS = ['Pagamentos', 'DDA', 'Extrato', 'Boletos'];
const PADROES_VAN = ['Nexxera', 'Finnet'];

const BancoForm: React.FC<BancoFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [nome, setNome] = useState(initialData?.nome || '');
  const [padraoVan, setPadraoVan] = useState(initialData?.padrao_van || '');
  const [cnab240, setCnab240] = useState(initialData?.cnab240 || false);
  const [cnab400, setCnab400] = useState(initialData?.cnab400 || false);
  const [cnab444, setCnab444] = useState(initialData?.cnab444 || false);
  const [produtos, setProdutos] = useState<string[]>(() => {
    // Garante que produtos seja sempre um array
    if (!initialData?.produtos) {
      return [];
    }
    
    if (Array.isArray(initialData.produtos)) {
      return initialData.produtos;
    }
    
    if (typeof initialData.produtos === 'string' && initialData.produtos.trim()) {
      return initialData.produtos.split(',').map((p: string) => p.trim()).filter((p: string) => p);
    }
    
    return [];
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleProduto = (produto: string) => {
    if (produtos.includes(produto)) {
      setProdutos(produtos.filter(p => p !== produto));
    } else {
      setProdutos([...produtos, produto]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome do banco é obrigatório';
    }
    
    if (!padraoVan) {
      newErrors.padraoVan = 'Padrão VAN é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Converte produtos array para string (conforme esperado pelo backend)
    const produtosString = produtos.length > 0 ? produtos.join(', ') : '';
    
    onSubmit({
      nome: nome.trim(),
      padrao_van: padraoVan,
      cnab240,
      cnab400,
      cnab444,
      produtos: produtosString, // Backend espera string, não array
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
        {initialData ? 'Editar Banco' : 'Novo Banco'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* Nome do Banco */}
        <TextField
          label="Nome do Banco"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          required
          error={!!errors.nome}
          helperText={errors.nome}
          sx={{ mb: 3 }}
          placeholder="Ex: Banco do Brasil"
        />

        {/* Padrão VAN */}
        <FormControl fullWidth required error={!!errors.padraoVan} sx={{ mb: 3 }}>
          <InputLabel>Padrão VAN</InputLabel>
          <Select
            value={padraoVan}
            onChange={(e) => setPadraoVan(e.target.value)}
            label="Padrão VAN"
          >
            {PADROES_VAN.map((padrao) => (
              <MenuItem key={padrao} value={padrao}>
                {padrao}
              </MenuItem>
            ))}
          </Select>
          {errors.padraoVan && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {errors.padraoVan}
            </Typography>
          )}
        </FormControl>

        {/* CNABs */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Suporte CNAB
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={cnab240}
                onChange={(e) => setCnab240(e.target.checked)}
                color="primary"
              />
            }
            label="CNAB 240"
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cnab400}
                onChange={(e) => setCnab400(e.target.checked)}
                color="primary"
              />
            }
            label="CNAB 400"
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cnab444}
                onChange={(e) => setCnab444(e.target.checked)}
                color="primary"
              />
            }
            label="CNAB 444"
          />
        </Box>

        {/* Produtos */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Produtos Disponíveis
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecione os produtos que este banco suporta:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {PRODUTOS_DISPONIVEIS.map((produto) => (
              <Chip
                key={produto}
                label={produto}
                onClick={() => toggleProduto(produto)}
                color={produtos.includes(produto) ? 'primary' : 'default'}
                variant={produtos.includes(produto) ? 'filled' : 'outlined'}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: produtos.includes(produto) 
                      ? theme.palette.primary.dark 
                      : theme.palette.action.hover,
                  },
                }}
              />
            ))}
          </Box>
          
          {produtos.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nenhum produto selecionado. O banco será cadastrado sem produtos específicos.
            </Alert>
          )}
        </Box>

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

export default BancoForm;