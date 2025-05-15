// Este arquivo simula as respostas do backend para testes do frontend

// Interfaces
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Bank {
  id: string;
  code: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
}

export interface VanLetter {
  id: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

// Mock do usuário autenticado
const mockUser: User = {
  id: 1,
  name: 'Usuário Teste',
  email: 'teste@tecnospeed.com.br',
};

// Mock do token JWT
const mockToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlVzdcOhcmlvIFRlc3RlIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Mock de bancos
const mockBanks: Bank[] = [
  { id: '001', code: '001', name: 'Banco do Brasil' },
  { id: '341', code: '341', name: 'Itaú' },
  { id: '033', code: '033', name: 'Santander' },
  { id: '237', code: '237', name: 'Bradesco' },
];

// Mock das cartas VAN
const mockLetters: VanLetter[] = [];

// Interface para serviço de autenticação
export interface AuthService {
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => void;
  getCurrentUser: () => User | null;
  isAuthenticated: () => boolean;
}

// Interface para serviço de banco
export interface BankService {
  getBanks: () => Promise<Bank[]>;
  getBankById: (id: string) => Promise<Bank | undefined>;
  getBankProducts: (bankId: string) => Promise<Product[]>;
}

// Interface para serviço de VAN
export interface VanService {
  createVanLetter: (data: any) => Promise<VanLetter>;
  getVanLetterById: (id: string) => Promise<VanLetter | undefined>;
  updateVanLetter: (id: string, data: any) => Promise<VanLetter>;
  getVanLettersByUser: () => Promise<VanLetter[]>;
  generateVanLetterPDF: (id: string) => Promise<Blob>;
}

// Substitui as chamadas à API por funções mock
export const mockAuthService: AuthService = {
  login: async (email, password) => {
    // Simula validação de credenciais
    if (email === 'teste@tecnospeed.com.br' && password === '123456') {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser, token: mockToken };
    } else {
      throw { response: { data: { message: 'Credenciais inválidas' } } };
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const mockBankService: BankService = {
  getBanks: async () => {
    return mockBanks;
  },
  getBankById: async (id) => {
    return mockBanks.find(bank => bank.id === id);
  },
  getBankProducts: async (bankId) => {
    return [
      {
        id: 'boletos',
        name: 'Boletos',
        description: 'Trafegar arquivos de remessa e retorno de boletos',
      },
      {
        id: 'pagamentos',
        name: 'Pagamentos',
        description: 'Trafegar arquivos de remessa e retorno de pagamentos',
      },
      {
        id: 'extrato',
        name: 'Extrato',
        description: 'Trafegar arquivos de extrato',
      },
      {
        id: 'dda',
        name: 'DDA',
        description: 'Trafegar arquivos de remessa de débitos',
      },
    ];
  },
};

export const mockVanService: VanService = {
  createVanLetter: async (data) => {
    const newLetter: VanLetter = {
      id: Date.now().toString(),
      ...data,
      status: 'created',
      createdAt: new Date().toISOString(),
    };
    mockLetters.push(newLetter);
    return newLetter;
  },
  getVanLetterById: async (id) => {
    return mockLetters.find(letter => letter.id === id);
  },
  updateVanLetter: async (id, data) => {
    const letterIndex = mockLetters.findIndex(letter => letter.id === id);
    if (letterIndex !== -1) {
      mockLetters[letterIndex] = { ...mockLetters[letterIndex], ...data };
      return mockLetters[letterIndex];
    }
    throw new Error('Carta não encontrada');
  },
  getVanLettersByUser: async () => {
    return mockLetters;
  },
  generateVanLetterPDF: async (id) => {
    return new Blob(['PDF simulado da carta VAN'], { type: 'application/pdf' });
  },
}; 