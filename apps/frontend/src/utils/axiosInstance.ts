import axios from 'axios';
import { authService } from '../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('🔗 API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 10000
});

// Interceptor para adicionar token em todas as requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Se não há token e não é uma requisição de login/refresh, redirecionar
      if (!config.url?.includes('/auth/login') && !config.url?.includes('/auth/refresh')) {
        console.warn('⚠️ Usuário não autenticado, redirecionando para login');
        authService.logout();
        window.location.href = '/';
        return Promise.reject(new Error('Usuário não autenticado'));
      }
    }
    console.log('📤 Requisição:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para renovação automática de tokens
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Resposta:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('❌ Erro na resposta:', error.response?.status, error.config?.url);
    
    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/refresh')) {
      const auth = authService.getAuthTokens();
      
      if (auth?.refreshToken) {
        try {
          console.log('🔄 Tentando renovar token...');
          const newTokens = await authService.refresh(auth.refreshToken);
          
          // Atualizar tokens no sessionStorage
          sessionStorage.setItem('auth', JSON.stringify(newTokens));
          
          // Reenviar requisição original com novo token
          error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          console.log('✅ Token renovado, reenviando requisição...');
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          console.error('❌ Falha na renovação do token:', refreshError);
          // Refresh falhou, fazer logout
          authService.logout();
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      } else {
        // Sem refresh token, fazer logout
        authService.logout();
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;