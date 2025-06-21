import axiosInstance from '../utils/axiosInstance';

export interface SolicitacaoCarta {
  id?: number;
  banco_id: number;
  produtos: string[];
  cnpj_software_house: string;
  cnpj_emitente: string;
  razao_social: string;
  nome_responsavel: string;
  cargo_responsavel: string;
  telefone: string;
  email: string;
  agencia: string;
  agencia_dv?: string;
  conta: string;
  conta_dv: string;
  convenio: string;
  cnab: string;
  nome_gerente: string;
  telefone_gerente: string;
  email_gerente: string;
  status?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total: number;
  em_aberto: number;
  finalizadas: number;
}

export const solicitacaoService = {
  // Criar nova solicitação
  create: async (solicitacao: SolicitacaoCarta): Promise<SolicitacaoCarta> => {
    const response = await axiosInstance.post('/solicitacoes', solicitacao);
    return response.data;
  },

  // Buscar todas as solicitações
  findAll: async (query?: { cnpj?: string; status?: string; banco_id?: number }): Promise<SolicitacaoCarta[]> => {
    const response = await axiosInstance.get('/solicitacoes', { params: query });
    return response.data;
  },

  // Buscar solicitação por ID
  findOne: async (id: number): Promise<SolicitacaoCarta> => {
    const response = await axiosInstance.get(`/solicitacoes/${id}`);
    return response.data;
  },

  // Atualizar solicitação
  update: async (id: number, solicitacao: Partial<SolicitacaoCarta>): Promise<SolicitacaoCarta> => {
    const response = await axiosInstance.patch(`/solicitacoes/${id}`, solicitacao);
    return response.data;
  },

  // Atualizar status da solicitação
  updateStatus: async (id: number, status: string, observacoes?: string): Promise<SolicitacaoCarta> => {
    const response = await axiosInstance.patch(`/solicitacoes/${id}/status`, { status, observacoes });
    return response.data;
  },

  // Remover solicitação - provavelmente não vai ser usado, mas deixei aqui para referencia
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/solicitacoes/${id}`);
  },

  // Buscar estatísticas do dashboard
  getDashboardStats: async (cnpj?: string): Promise<DashboardStats> => {
    const response = await axiosInstance.get('/solicitacoes/dashboard', { params: { cnpj } });
    return response.data;
  },
}; 