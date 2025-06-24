import axiosInstance from '../utils/axiosInstance';

const URL_CONTROLLER = "/usuarios";

export interface Usuario {
  id: number;
  cnpj: string;
  tipo: 'ADMIN' | 'SH';
  nome_empresa?: string;
  email?: string;
  telefone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUsuarioData {
  cnpj: string;
  token: string;
  tipo: 'ADMIN' | 'SH';
  nome_empresa?: string;
  email?: string;
  telefone?: string;
}

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axiosInstance.get(URL_CONTROLLER);
  return response.data;
};

export const canDeleteUsuario = async (id: number): Promise<{ canDelete: boolean; message?: string }> => {
  const response = await axiosInstance.get(`${URL_CONTROLLER}/${id}/can-delete`);
  return response.data;
};

export const createUsuario = async (usuarioData: CreateUsuarioData): Promise<Usuario> => {
  const response = await axiosInstance.post(URL_CONTROLLER, usuarioData);
  return response.data;
};

export const updateUsuario = async (id: number, usuarioData: Partial<CreateUsuarioData>): Promise<Usuario> => {
  const response = await axiosInstance.patch(`${URL_CONTROLLER}/${id}`, usuarioData);
  return response.data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  const response = await axiosInstance.delete(`${URL_CONTROLLER}/${id}`);
  return response.data;
}; 