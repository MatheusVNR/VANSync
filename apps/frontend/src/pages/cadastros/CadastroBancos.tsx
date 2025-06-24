import React, { useState, useEffect, useRef } from 'react';
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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
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
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<Banco | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const formRef = useRef<HTMLDivElement>(null);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const fetchBanks = async () => {
    try {
      setTableLoading(true);
      const data = await getBancos();
      setBanks(data);
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
      showSnackbar('Erro ao carregar bancos. Tente novamente.', 'error');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      setLoading(true);
      await createBanco(data);
      setShowForm(false);
      await fetchBanks();
      showSnackbar('Banco criado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar banco:', error);
      showSnackbar('Erro ao criar banco. Verifique os dados e tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (editingBank) {
      try {
        setLoading(true);
        await updateBanco(editingBank.codigo, data);
        setEditingBank(null);
        setShowForm(false);
        await fetchBanks();
        showSnackbar('Banco atualizado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao atualizar banco:', error);
        showSnackbar('Erro ao atualizar banco. Verifique os dados e tente novamente.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClick = (bank: Banco) => {
    setBankToDelete(bank);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bankToDelete) {
      try {
        setLoading(true);
        await deleteBanco(bankToDelete.codigo);
        await fetchBanks();
        showSnackbar('Banco excluído com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao excluir banco:', error);
        showSnackbar('Erro ao excluir banco. Tente novamente.', 'error');
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setBankToDelete(null);
      }
    }
  };

  const handleEditClick = (bank: Banco) => {
    setEditingBank(bank);
    setShowForm(true);
    setTimeout(() => {
      scrollToForm();
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBank(null);
  };

  const formatProdutos = (produtos: string[] | undefined) => {
    if (!produtos || produtos.length === 0) {
      return 'Nenhum produto';
    }
    return produtos.join(', ');
  };

  return (
    <Box>
      {/* Header com Botões */}
      {!showForm && !editingBank && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}>
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Cadastro de Bancos
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchBanks}
              disabled={tableLoading}
              sx={{ borderRadius: 2 }}
            >
              {!isMobile && 'Atualizar'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setShowForm(true);
                setTimeout(() => {
                  scrollToForm();
                }, 100);
              }}
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
        </Box>
      )}

      {/* Formulário */}
      {(showForm || editingBank) && (
        <Fade in={true} timeout={300}>
          <Box ref={formRef} sx={{ mb: 4 }}>
            <BancoForm
              initialData={editingBank ? { ...editingBank } : undefined}
              onSubmit={editingBank ? handleUpdate : handleCreate}
              onCancel={handleCancelForm}
              loading={loading}
            />
          </Box>
        </Fade>
      )}

      {/* Tabela */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Padrão VAN</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>CNAB 240</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CNAB 400</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CNAB 444</TableCell>
                  </>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Produtos</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 8} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Carregando bancos...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : bancos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 5 : 8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum banco cadastrado.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setShowForm(true);
                        setTimeout(() => {
                          scrollToForm();
                        }, 100);
                      }}
                      sx={{ mt: 2 }}
                    >
                      Cadastrar Primeiro Banco
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                bancos.map((bank) => (
                  <TableRow key={bank.codigo} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
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
                    {!isMobile && (
                      <>
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
                      </>
                    )}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {formatProdutos(bank.produtos)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(bank)}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(bank)}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o banco <strong>{bankToDelete?.nome}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CadastroBancos;