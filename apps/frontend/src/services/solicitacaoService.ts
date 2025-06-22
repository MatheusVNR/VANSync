import axiosInstance from '../utils/axiosInstance';

export interface SolicitacaoCarta {
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
  agencia_dv: string;
  conta: string;
  conta_dv: string;
  convenio: string;
  cnab: string;
  nome_gerente: string;
  telefone_gerente: string;
  email_gerente: string;
}

export interface CartaPDF {
  produto: string;
  pdf_url: string;
  email_enviado: boolean;
  zapier_integrado: boolean;
}

export interface SolicitacaoResponse {
  id: number;
  status: string;
  cartas: CartaPDF[];
  created_at: string;
}

export interface DashboardStats {
  total_solicitacoes: number;
  solicitacoes_pendentes: number;
  solicitacoes_aprovadas: number;
  solicitacoes_rejeitadas: number;
}

class SolicitacaoService {
  async create(solicitacao: SolicitacaoCarta): Promise<SolicitacaoResponse> {
    try {
      const response = await axiosInstance.post('/solicitacoes', solicitacao);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar solicitação');
    }
  }

  async getAll(): Promise<SolicitacaoResponse[]> {
    try {
      const response = await axiosInstance.get('/solicitacoes');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar solicitações');
    }
  }

  async getById(id: number): Promise<SolicitacaoResponse> {
    try {
      const response = await axiosInstance.get(`/solicitacoes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar solicitação');
    }
  }

  async generateCartasPDF(solicitacao: SolicitacaoCarta): Promise<CartaPDF[]> {
    try {
      const response = await axiosInstance.post('/solicitacoes/generate-pdfs', solicitacao);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar PDFs das cartas');
    }
  }

  async sendCartasEmail(solicitacaoId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post(`/solicitacoes/${solicitacaoId}/send-emails`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao enviar e-mails das cartas');
    }
  }

  async integrateZapier(solicitacaoId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post(`/solicitacoes/${solicitacaoId}/zapier-integration`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao integrar com Zapier');
    }
  }

  async getCartaTemplate(bancoId: number, produto: string): Promise<string> {
    try {
      const response = await axiosInstance.get(`/bancos/${bancoId}/carta-template/${produto}`);
      return response.data.template;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar template da carta');
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await axiosInstance.get('/solicitacoes/dashboard-stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar estatísticas');
    }
  }
}

export const solicitacaoService = new SolicitacaoService(); 