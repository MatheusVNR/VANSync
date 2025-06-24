import axiosInstance from '../utils/axiosInstance';

export interface SolicitacaoCarta {
  cnpj: string;
  banco_id: number;
  produtos: string;
  fornecedor_van: string;
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
  cidade?: string;
  estado?: string;
  preferencia_contato_gerente?: string;
}

export interface CartaPDF {
  produto: string;
  pdf_url: string;
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

  async sendCartasEmail(solicitacaoId: number): Promise<{ success: boolean; message: string; emailsEnviados: number }> {
    try {
      const response = await axiosInstance.post(`/solicitacoes/${solicitacaoId}/send-emails`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao enviar e-mails das cartas');
    }
  }

  async integrateZapier(solicitacaoId: number): Promise<{ success: boolean; message: string; integracoesEnviadas: number }> {
    try {
      const response = await axiosInstance.post(`/solicitacoes/${solicitacaoId}/zapier-integration`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao integrar com Zapier');
    }
  }

  async integrateZapierDirect(data: {
    cnpj_sh: string;
    email: string;
    cnpj_cliente: string;
    produto: string;
    arquivo: string; // base64
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post('/zapier/integrate', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao integrar com Zapier');
    }
  }

  async finalizarSolicitacao(solicitacaoId: number): Promise<{ success: boolean; message: string; solicitacao: any }> {
    try {
      const response = await axiosInstance.post(`/solicitacoes/${solicitacaoId}/finalizar`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao finalizar solicitação');
    }
  }

  async processarCompleto(solicitacaoId: number): Promise<{
    success: boolean;
    message: string;
    resultados: {
      emails: { success: boolean; message: string; emailsEnviados: number };
      zapier: { success: boolean; message: string; integracoesEnviadas: number };
      finalizacao: { success: boolean; message: string };
    };
    solicitacao: any;
  }> {
    try {
      const response = await axiosInstance.post(`/solicitacoes/${solicitacaoId}/processar-completo`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro no processamento completo');
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

  async generatePreviewPDFs(data: {
    banco_id: number;
    produtos: string[];
    formData: any;
    fornecedor_van: string;
  }): Promise<{
    success: boolean;
    pdfs?: Array<{
      produto: string;
      pdfBase64: string;
      titulo: string;
    }>;
    message?: string;
  }> {
    try {
      const response = await axiosInstance.post('/solicitacoes/preview-pdf', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao gerar PDFs de preview');
    }
  }
}

export const solicitacaoService = new SolicitacaoService(); 