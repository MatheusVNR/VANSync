import React, { useEffect, useState } from 'react';
import {
  Box,
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
  CircularProgress,
  Fade,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Visibility as VisibilityIcon, Search as SearchIcon, Refresh as RefreshIcon, Edit as EditIcon, Download as DownloadIcon } from '@mui/icons-material';
import { solicitacaoService } from '../services/solicitacaoService';
import { authService } from '../services/authService';
import MainLayout from '../components/MainLayout';
import BackButton from '../components/BackButton';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'em_aberto', label: 'Em aberto' },
  { value: 'em_analise', label: 'Em análise' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'rejeitada', label: 'Rejeitada' },
];

const statusColors: Record<string, any> = {
  em_aberto: 'warning',
  em_analise: 'info',
  aprovada: 'success',
  rejeitada: 'error',
};

const statusLabels: Record<string, string> = {
  em_aberto: 'Em aberto',
  em_analise: 'Em análise',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
};

const GerenciarSolicitacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dadosCarta, setDadosCarta] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [editStatusId, setEditStatusId] = useState<number|null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchSolicitacoes = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const data = await solicitacaoService.getAll(params);
      setSolicitacoes(data);
      setFiltered(data);
    } catch (err) {
      setSolicitacoes([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [statusFilter]);

  // Proteção: só ADMIN pode acessar
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.tipo !== 'ADMIN') {
      window.location.href = '/menu';
    }
  }, []);

  // Busca por semelhança
  useEffect(() => {
    if (!search) {
      setFiltered(solicitacoes);
      return;
    }
    const lower = search.toLowerCase();
    setFiltered(
      solicitacoes.filter((s) => {
        const banco = s.banco ? `${s.banco.codigo.toString().padStart(3, '0')} - ${s.banco.nome}` : '';
        const produto = s.produto || '';
        const fornecedor = s.fornecedor_van || '';
        const status = s.status || '';
        const created = s.created_at || '';
        const updated = s.updated_at || '';
        let dadosCartaStr = '';
        if (s.dados_carta) {
          try {
            dadosCartaStr = typeof s.dados_carta === 'string' ? s.dados_carta : JSON.stringify(s.dados_carta);
          } catch {}
        }
        return (
          String(s.id).includes(lower) ||
          banco.toLowerCase().includes(lower) ||
          produto.toLowerCase().includes(lower) ||
          fornecedor.toLowerCase().includes(lower) ||
          status.toLowerCase().includes(lower) ||
          created.toLowerCase().includes(lower) ||
          updated.toLowerCase().includes(lower) ||
          dadosCartaStr.toLowerCase().includes(lower)
        );
      })
    );
  }, [search, solicitacoes]);

  const handleShowDadosCarta = (dados: any) => {
    setDadosCarta(dados);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setDadosCarta(null);
  };

  const handleEditStatus = (id: number, currentStatus: string) => {
    setEditStatusId(id);
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async (id: number) => {
    setSavingStatus(true);
    try {
      await solicitacaoService.updateStatus(id, newStatus);
      setEditStatusId(null);
      setNewStatus('');
      fetchSolicitacoes();
    } catch (err) {
      // Pode exibir erro se quiser
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1200 }}>
          {/* Header com Botão Voltar e Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <BackButton onClick={() => window.history.back()} />
            <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Gerenciar Solicitações
            </Typography>
          </Box>
          {/* Campo de busca, filtro e refresh */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Buscar por qualquer campo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ maxWidth: 400 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={e => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <RefreshIcon
              onClick={fetchSolicitacoes}
              sx={{ cursor: loading ? 'not-allowed' : 'pointer', color: loading ? 'text.disabled' : 'primary.main', fontSize: 32 }}
              titleAccess="Atualizar"
            />
          </Box>
          {/* Tabela */}
          <Fade in={true} timeout={300}>
            <Paper sx={{ overflow: 'hidden', borderRadius: 3, boxShadow: 4, maxWidth: '100%', mx: 'auto', p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                      <TableCell sx={{ fontWeight: 600 }}>Solicitação</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Banco</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Produto</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fornecedor VAN</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Criada em</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Atualizada em</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Download Carta</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                          <CircularProgress size={24} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Carregando solicitações...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhuma solicitação encontrada.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((s) => (
                        <TableRow key={s.id} hover>
                          <TableCell>{s.id}</TableCell>
                          <TableCell>{s.banco ? `${s.banco.codigo.toString().padStart(3, '0')} - ${s.banco.nome}` : '-'}</TableCell>
                          <TableCell>{s.produto || '-'}</TableCell>
                          <TableCell>{s.fornecedor_van || '-'}</TableCell>
                          <TableCell>
                            {editStatusId === s.id ? (
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={newStatus}
                                  onChange={e => setNewStatus(e.target.value)}
                                >
                                  {statusOptions.filter(opt => opt.value).map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : (
                              <Chip label={statusLabels[s.status] || s.status} size="small" color={statusColors[s.status] || 'default'} />
                            )}
                          </TableCell>
                          <TableCell>{s.created_at ? new Date(s.created_at).toLocaleString('pt-BR') : '-'}</TableCell>
                          <TableCell>{s.updated_at ? new Date(s.updated_at).toLocaleString('pt-BR') : '-'}</TableCell>
                          <TableCell>
                            <Tooltip title="Baixar PDF da carta">
                              <span>
                                <IconButton
                                  onClick={async () => {
                                    setDownloadingId(s.id);
                                    try {
                                      await solicitacaoService.downloadPdfById(s.id);
                                    } finally {
                                      setDownloadingId(null);
                                    }
                                  }}
                                  disabled={downloadingId === s.id}
                                >
                                  {downloadingId === s.id ? <CircularProgress size={20} /> : <DownloadIcon />}
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {editStatusId === s.id ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => handleSaveStatus(s.id)}
                                disabled={savingStatus}
                              >
                                Salvar
                              </Button>
                            ) : (
                              <Tooltip title="Alterar status">
                                <IconButton onClick={() => handleEditStatus(s.id, s.status)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Fade>
          {/* Modal de dados da carta */}
          <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
            <DialogTitle>Dados da Carta</DialogTitle>
            <DialogContent>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {dadosCarta ? JSON.stringify(dadosCarta, null, 2) : ''}
              </pre>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="contained">Fechar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default GerenciarSolicitacoes; 