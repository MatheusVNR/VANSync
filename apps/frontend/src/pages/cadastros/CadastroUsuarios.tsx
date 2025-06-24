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
  Person as PersonIcon,
} from '@mui/icons-material';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario, canDeleteUsuario, Usuario, CreateUsuarioData } from '../../services/usuarioService';
import UsuarioForm from '../../components/cadastros/UsuarioForm';

const CadastroUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
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

  const fetchUsuarios = async () => {
    try {
      setTableLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showSnackbar('Erro ao carregar usuários. Tente novamente.', 'error');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreate = async (data: CreateUsuarioData) => {
    try {
      setLoading(true);
      await createUsuario(data);
      setShowForm(false);
      await fetchUsuarios();
      showSnackbar('Usuário criado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      showSnackbar('Erro ao criar usuário. Verifique os dados e tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CreateUsuarioData) => {
    if (editingUsuario) {
      try {
        setLoading(true);
        await updateUsuario(editingUsuario.id, data);
        setEditingUsuario(null);
        setShowForm(false);
        await fetchUsuarios();
        showSnackbar('Usuário atualizado com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        showSnackbar('Erro ao atualizar usuário. Verifique os dados e tente novamente.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClick = (usuario: Usuario) => {
    // Verifica se pode excluir antes de mostrar o dialog
    canDeleteUsuario(usuario.id)
      .then((canDelete) => {
        if (!canDelete.canDelete) {
          showSnackbar(canDelete.message || 'Não é possível excluir este usuário.', 'error');
          return;
        }
        
        // Se pode excluir, mostra o dialog de confirmação
        setUsuarioToDelete(usuario);
        setDeleteDialogOpen(true);
      })
      .catch((error: any) => {
        console.error('Erro ao verificar se pode excluir:', error);
        showSnackbar('Erro ao verificar permissão de exclusão.', 'error');
      });
  };

  const handleDeleteConfirm = async () => {
    if (usuarioToDelete) {
      try {
        setLoading(true);
        await deleteUsuario(usuarioToDelete.id);
        await fetchUsuarios();
        showSnackbar('Usuário excluído com sucesso!', 'success');
      } catch (error: any) {
        console.error('Erro ao excluir usuário:', error);
        
        // Verifica se é erro específico do backend
        if (error.response?.data?.message) {
          showSnackbar(error.response.data.message, 'error');
        } else {
          showSnackbar('Erro ao excluir usuário. Tente novamente.', 'error');
        }
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setUsuarioToDelete(null);
      }
    }
  };

  const handleEditClick = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
    setTimeout(() => {
      scrollToForm();
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Box>
      {/* Header com Botões */}
      {!showForm && !editingUsuario && (
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
            Cadastro de Usuários
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsuarios}
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
              Novo Usuário
            </Button>
          </Box>
        </Box>
      )}

      {/* Formulário */}
      {(showForm || editingUsuario) && (
        <Fade in={true} timeout={300}>
          <Box ref={formRef} sx={{ mb: 4 }}>
            <UsuarioForm
              initialData={editingUsuario || undefined}
              onSubmit={editingUsuario ? handleUpdate : handleCreate}
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
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CNPJ</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Empresa</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cadastrado em</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Carregando usuários...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum usuário cadastrado.
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
                      Cadastrar Primeiro Usuário
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {usuario.id.toString().padStart(3, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {formatCNPJ(usuario.cnpj)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {usuario.nome_empresa || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={usuario.tipo === 'ADMIN' ? 'Administrador' : 'Software House'} 
                        size="small" 
                        color={usuario.tipo === 'ADMIN' ? 'error' : 'primary'} 
                        variant="outlined"
                        icon={<PersonIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {usuario.email || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {usuario.telefone || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {usuario.createdAt ? formatDate(usuario.createdAt) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(usuario)}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(usuario)}
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
            Tem certeza que deseja excluir o usuário <strong>{usuarioToDelete?.nome_empresa || usuarioToDelete?.cnpj}</strong>?
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

export default CadastroUsuarios; 