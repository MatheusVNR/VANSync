import axios from 'axios';
import { authService } from '../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('🔗 API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 60000
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
    const originalRequest = error.config;
    console.error('❌ Erro na resposta:', error.response?.status, originalRequest?.url);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const currentAuth = authService.getAuthTokens();
      if (currentAuth?.refreshToken) {
        try {
          console.log('🔄 Tentando renovar token...');
          const newAuthData = await authService.refresh(currentAuth.refreshToken);
          
          // Salvar novos tokens
          sessionStorage.setItem('auth', JSON.stringify(newAuthData));
          
          console.log('✅ Token renovado, reenviando requisição...');
          
          // Atualizar cabeçalho da requisição original e reenviar
          originalRequest.headers['Authorization'] = `Bearer ${newAuthData.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('❌ Falha na renovação do token:', refreshError);
          authService.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;