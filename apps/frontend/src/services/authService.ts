import axiosInstance from '../utils/axiosInstance';
import { IAuthService } from './interfaces/iAuthService';

export interface LoginResponse {
  user: {
    id: number;
    cnpj: string;
    tipo: 'ADMIN' | 'SH';
    nome_empresa?: string;
    email?: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const authService: IAuthService = {
  login: async (cnpj: string, token: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', { cnpj, token });
    const data = response.data;
    
    // Salvar tokens no sessionStorage
    const authData = {
      accessToken: data.token,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + (data.expiresIn * 1000)
    };
    
    sessionStorage.setItem('auth', JSON.stringify(authData));
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return {
      accessToken: response.data.token,
      refreshToken: response.data.refreshToken,
      expiresAt: Date.now() + (response.data.expiresIn * 1000)
    };
  },

  logout: (): void => {
    // Remove dados do sessionStorage
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('user');
  },

  getCurrentUser: (): any => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAuthTokens: (): AuthTokens | null => {
    const auth = sessionStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  },

  getToken: (): string | null => {
    const auth = authService.getAuthTokens();
    return auth?.accessToken || null;
  },

  isAuthenticated: (): boolean => {
    const auth = authService.getAuthTokens();
    if (!auth) return false;
    
    // Verifica se o token não expirou
    return Date.now() < auth.expiresAt;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.tipo === 'ADMIN';
  },

  isSoftwareHouse: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.tipo === 'SH';
  }
};