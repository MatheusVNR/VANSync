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
  Button
} from '@mui/material';
import { Visibility as VisibilityIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { solicitacaoService, SolicitacaoResponse } from '../services/solicitacaoService';
import { authService } from '../services/authService';
import MainLayout from '../components/MainLayout';
import BackButton from '../components/BackButton';

interface Banco {
  codigo: number;
  nome: string;
}

interface Solicitacao {
  id: number;
  banco: Banco;
  produto: string;
  fornecedor_van: string;
  status: string;
  created_at: string;
  updated_at: string;
  dados_carta: any;
}

const MinhasSolicitacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dadosCarta, setDadosCarta] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Função para buscar solicitações do usuário logado
  const fetchSolicitacoes = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      const params = user && user.cnpj ? { cnpj: user.cnpj } : {};
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
  }, []);

  // Proteção: só SH pode acessar
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.tipo !== 'SH') {
      window.location.href = '/menu';
    }
  }, []);

  // Busca por semelhança em todas as colunas visíveis e dados_carta
  useEffect(() => {
    if (!search) {
      setFiltered(solicitacoes);
      return;
    }
    const lower = search.toLowerCase();
    setFiltered(
      solicitacoes.filter((s) => {
        const banco = s.banco ? `${s.banco.codigo} - ${s.banco.nome}` : '';
        const produto = s.produto || '';
        const fornecedor = s.fornecedor_van || '';
        const status = s.status || '';
        const created = s.created_at || '';
        const updated = s.updated_at || '';
        // dados_carta pode ser objeto ou string
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

  // Função para exibir status amigável e cor
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'em_aberto':
        return { label: 'Em aberto', color: 'warning' };
      case 'em_analise':
        return { label: 'Em análise', color: 'info' };
      case 'aprovada':
        return { label: 'Aprovada', color: 'success' };
      case 'rejeitada':
        return { label: 'Rejeitada', color: 'error' };
      default:
        return { label: status, color: 'default' };
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
              Minhas Solicitações
            </Typography>
          </Box>
          {/* Campo de busca e botão de refresh */}
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
            <RefreshIcon
              onClick={fetchSolicitacoes}
              sx={{ cursor: loading ? 'not-allowed' : 'pointer', color: loading ? 'text.disabled' : 'primary.main', fontSize: 32 }}
              titleAccess="Atualizar"
            />
          </Box>
          {/* Tabela centralizada, sem ações */}
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
                      <TableCell sx={{ fontWeight: 600 }}>Dados da Carta</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                          <CircularProgress size={24} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Carregando solicitações...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nenhuma solicitação encontrada.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((s) => {
                        const statusInfo = getStatusInfo(s.status);
                        return (
                          <TableRow key={s.id} hover>
                            <TableCell>{s.id}</TableCell>
                            <TableCell>{s.banco ? `${s.banco.codigo.toString().padStart(3, '0')} - ${s.banco.nome}` : '-'}</TableCell>
                            <TableCell>{s.produto || '-'}</TableCell>
                            <TableCell>{s.fornecedor_van || '-'}</TableCell>
                            <TableCell>
                              <Chip label={statusInfo.label} size="small" color={statusInfo.color as any} />
                            </TableCell>
                            <TableCell>{s.created_at ? new Date(s.created_at).toLocaleString('pt-BR') : '-'}</TableCell>
                            <TableCell>{s.updated_at ? new Date(s.updated_at).toLocaleString('pt-BR') : '-'}</TableCell>
                            <TableCell>
                              <Tooltip title="Ver dados da carta">
                                <IconButton onClick={() => handleShowDadosCarta(s.dados_carta)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
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

export default MinhasSolicitacoes; 