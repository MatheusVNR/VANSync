import api from './api';
import { mockVanService, VanService, VanLetter } from './mock.service';

// Use o mock em ambiente de desenvolvimento ou se não houver API configurada
const useMock = true;

export const vanService: VanService = useMock ? mockVanService : {
  async createVanLetter(data: any): Promise<VanLetter> {
    const response = await api.post('/van-letters', data);
    return response.data;
  },

  async getVanLetterById(id: string): Promise<VanLetter | undefined> {
    const response = await api.get(`/van-letters/${id}`);
    return response.data;
  },

  async updateVanLetter(id: string, data: any): Promise<VanLetter> {
    const response = await api.put(`/van-letters/${id}`, data);
    return response.data;
  },

  async getVanLettersByUser(): Promise<VanLetter[]> {
    const response = await api.get('/van-letters/my-letters');
    return response.data;
  },

  async generateVanLetterPDF(id: string): Promise<Blob> {
    const response = await api.get(`/van-letters/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 