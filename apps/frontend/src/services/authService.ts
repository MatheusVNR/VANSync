import axiosInstance from '../utils/axiosInstance';
import { IAuthService } from './interfaces/iAuthService';

export const authService: IAuthService = {
  login : async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data?.message != null)
        return response.data.message;

    return response.data;
  }
};