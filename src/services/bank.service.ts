import api from './api';
import { mockBankService, BankService, Bank, Product } from './mock.service';

// Use o mock em ambiente de desenvolvimento ou se não houver API configurada
const useMock = true;

export const bankService: BankService = useMock ? mockBankService : {
  async getBanks(): Promise<Bank[]> {
    const response = await api.get('/banks');
    return response.data;
  },

  async getBankById(id: string): Promise<Bank | undefined> {
    const response = await api.get(`/banks/${id}`);
    return response.data;
  },

  async getBankProducts(bankId: string): Promise<Product[]> {
    const response = await api.get(`/banks/${bankId}/products`);
    return response.data;
  },
}; 