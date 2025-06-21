import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getBancos, createBanco, updateBanco, deleteBanco } from '../../services/bancoService';
import BancoForm from '../../components/cadastros/BancoForm';

interface Banco {
  codigo: number;
  nome: string;
  padrao_van: string;
  cnab240?: boolean;
  cnab400?: boolean;
  cnab444?: boolean;
  produtos?: string[];
  ativo?: boolean;
}

const CadastroBancos: React.FC = () => {
  const [bancos, setBanks] = useState<Banco[]>([]);
  const [editingBank, setEditingBank] = useState<Banco | null>(null);
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchBanks = async () => {
    try {
      const data = await getBancos();
      setBanks(data);
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createBanco(data);
      setShowForm(false);
      fetchBanks();
    } catch (error) {
      console.error('Erro ao criar banco:', error);
    }
  };

  const handleUpdate = async (data: any) => {
    if (editingBank) {
      try {
        await updateBanco(editingBank.codigo, data);
        setEditingBank(null);
        setShowForm(false);
        fetchBanks();
      } catch (error) {
        console.error('Erro ao atualizar banco:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este banco?')) {
      try {
        await deleteBanco(id);
        fetchBanks();
      } catch (error) {
        console.error('Erro ao excluir banco:', error);
      }
    }
  };

  return (
    <Box>
      {/* Botão Novo Banco */}
      {!showForm && !editingBank && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: theme.palette.success.main,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            Novo Banco
          </Button>
        </Box>
      )}

      {/* Formulário */}
      {(showForm || editingBank) && (
        <Paper sx={{ mb: 4, p: 3 }}>
          <BancoForm
            initialData={editingBank ? { ...editingBank } : undefined}
            onSubmit={editingBank ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingBank(null);
            }}
          />
        </Paper>
      )}

      {/* Tabela */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Padrão VAN</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CNAB 240</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CNAB 400</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CNAB 444</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Produtos</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bancos.map((bank) => (
                <TableRow key={bank.codigo} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {bank.codigo.toString().padStart(3, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {bank.nome}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bank.padrao_van} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bank.cnab240 ? 'Sim' : 'Não'} 
                      size="small" 
                      color={bank.cnab240 ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bank.cnab400 ? 'Sim' : 'Não'} 
                      size="small" 
                      color={bank.cnab400 ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bank.cnab444 ? 'Sim' : 'Não'} 
                      size="small" 
                      color={bank.cnab444 ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {bank.produtos?.map((produto, index) => (
                        <Chip 
                          key={index}
                          label={produto} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingBank(bank);
                            setShowForm(true);
                          }}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(bank.codigo)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {bancos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum banco cadastrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CadastroBancos;