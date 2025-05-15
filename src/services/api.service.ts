import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  responsavelNome: string;
  responsavelCargo: string;
  responsavelTelefone: string;
  responsavelEmail: string;
  banco: string;
  agencia: string;
  conta: string;
  convenio: string;
  gerenteConta: string;
  gerenteTelefone: string;
  gerenteEmail: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  ticketNumber?: string;
  pdfUrl?: string;
}

// Tipo para erros da API
interface ApiError {
  message: string;
}

// Configuração do cliente axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Serviço de API
export const apiService = {
  // Método para enviar os dados do formulário
  async submitForm(data: CompanyData): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/form/submit', data);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao enviar formulário:', error);
      const axiosError = error as AxiosError<ApiError>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Erro ao enviar formulário',
      };
    }
  },

  // Método para obter o URL do PDF
  getPdfUrl(ticketNumber: string): string {
    return `${API_URL}/form/pdf/${ticketNumber.replace('#', '')}`;
  },

  // Método para baixar o PDF
  async downloadPdf(ticketNumber: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/form/pdf/${ticketNumber.replace('#', '')}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao baixar PDF:', error);
      throw new Error('Não foi possível baixar o PDF');
    }
  }
}; 